from rest_framework import generics, views, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import serializers
from django.http import JsonResponse
from app.models.models import TradesmanProfile
import logging

logger = logging.getLogger(__name__)

class TradesmanListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = TradesmanProfile
        fields = ('email', 'profession', 'experience', 'location', 'description', 'price', 'hourly_rate', 'specialties', 'is_approved')

class CustomExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code == 401:
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            print(f"Authorization header: {auth_header}")
            print(f"User: {request.user}")
            print(f"Is authenticated: {request.user.is_authenticated}")
        return response

class TradesmanListView(generics.ListAPIView):
    """
    List all tradesmen with their details
    """
    serializer_class = TradesmanListSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def get_queryset(self):
        return TradesmanProfile.objects.all()

class ApproveTradesmanView(views.APIView):
    """
    Approve a tradesman profile
    """
    permission_classes = [IsAdminUser]

    def post(self, request, tradesman_id):
        try:
            # Log the request details
            logger.info(f"Approving tradesman with ID: {tradesman_id}")
            logger.info(f"Request user: {request.user}")
            logger.info(f"User is admin: {request.user.is_staff}")

            tradesman = TradesmanProfile.objects.get(id=tradesman_id)
            tradesman.is_approved = True
            tradesman.save()
            
            logger.info(f"Successfully approved tradesman: {tradesman.user.email}")
            
            return Response({
                'message': 'Tradesman approved successfully',
                'tradesman': {
                    'id': tradesman.id,
                    'email': tradesman.user.email,
                    'profession': tradesman.profession,
                    'is_approved': tradesman.is_approved
                }
            }, status=status.HTTP_200_OK)
            
        except TradesmanProfile.DoesNotExist:
            logger.error(f"Tradesman not found with ID: {tradesman_id}")
            return Response({
                'error': 'Tradesman not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            logger.error(f"Error approving tradesman: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)