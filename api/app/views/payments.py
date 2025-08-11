from django.http import HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import os, json
import stripe
from dotenv import load_dotenv
from app.models import StripeCheckoutSession
load_dotenv()


stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
YOUR_DOMAIN = os.getenv('BASE_URL')

@method_decorator(csrf_exempt, name='dispatch')
class CreateCheckoutSessionView(View):
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            product = stripe.Product.create(
                name=data.get('name'),
                description=data.get('description'),
            )
            price = stripe.Price.create(
                product=product.id,
                unit_amount=data.get('unit_amount'),
                currency='usd'
            )
            stripe_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        # Provide the exact Price ID (for example, price_1234) of the product you want to sell
                        'price': price.id,
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=f'{YOUR_DOMAIN}/payment/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{YOUR_DOMAIN}/payment/cancel?session_id={{CHECKOUT_SESSION_ID}}',
            )
            
            # Save session to database
            checkout_session = StripeCheckoutSession.from_stripe_payload(stripe_session)
            checkout_session.save()
            
            return JsonResponse({
                'id': checkout_session.id,
                'url': stripe_session.url
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class PaymentSuccessView(View):
    def get(self, request):
        # Get the session ID from the URL
        session_id = request.GET.get('session_id')
        
        if not session_id:
            # If no session_id in URL params, try to get it from the Stripe session
            try:
                # Get the session ID from the URL path
                path = request.get_full_path()
                # Extract session ID from path (Stripe adds it as a URL parameter)
                session_id = path.split('session_id=')[-1].split('&')[0]
            except:
                return JsonResponse({'error': 'No session ID found'}, status=400)
        
        try:
            # Retrieve the session from Stripe
            session = stripe.checkout.Session.retrieve(session_id)
            
            # Update the database with the completed status
            checkout_session = StripeCheckoutSession.objects.get(id=session_id)
            checkout_session.status = session.status
            checkout_session.payment_status = session.payment_status
            checkout_session.save()
            
            return JsonResponse({
                'message': 'Payment successful',
                'session': session
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class PaymentCancelView(View):
    def get(self, request):
        # Get the session ID from the URL
        session_id = request.GET.get('session_id')
        
        if not session_id:
            # If no session_id in URL params, try to get it from the Stripe session
            try:
                # Get the session ID from the URL path
                path = request.get_full_path()
                # Extract session ID from path (Stripe adds it as a URL parameter)
                session_id = path.split('session_id=')[-1].split('&')[0]
            except:
                return JsonResponse({'error': 'No session ID found'}, status=400)
        
        try:
            # Retrieve the session from Stripe
            session = stripe.checkout.Session.retrieve(session_id)
            
            # Update the database with the canceled status
            checkout_session = StripeCheckoutSession.objects.get(id=session_id)
            checkout_session.status = session.status
            checkout_session.payment_status = session.payment_status
            checkout_session.save()
            
            return JsonResponse({
                'message': 'Payment canceled',
                'session': session
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
