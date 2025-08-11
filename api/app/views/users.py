from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, TradesmanRegistrationSerializer
from rest_framework import serializers
from app.models.models import TradesmanProfile

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for registration

    def create(self, request, *args, **kwargs):
        try:

            print(request.data)
            # Get the serializer
            serializer = self.get_serializer(data=request.data)
            
            if serializer.is_valid():
                user = serializer.save()
                
                # Generate and return JWT token
                refresh = TokenObtainPairSerializer.get_token(user)
                
                # Check if this user has a tradesman profile
                is_tradesman = hasattr(user, 'tradesman_profile')
                message = 'Tradesman registered successfully' if is_tradesman else 'User registered successfully'
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': message,
                    'is_tradesman': is_tradesman
                }, status=status.HTTP_201_CREATED)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                attrs['username'] = email
                
                # Get user type
                is_tradesman = True if hasattr(user, 'tradesman_profile') else False
                
                # Add user type to token
                refresh = self.get_token(user)
                refresh['is_tradesman'] = is_tradesman
                refresh['email'] = email
                
                return {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'is_tradesman': is_tradesman,
                    'email': email
                }
            else:
                raise serializers.ValidationError('Invalid credentials')
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid credentials')


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Get the tokens from the response data
        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')
        
        if access_token and refresh_token:
            # Get the user from the access token
            try:
                token = AccessToken(access_token)
                user_id = token.payload.get('user_id')
                user = User.objects.get(id=user_id)
                
                # Check if user is tradesman
                is_tradesman = hasattr(user, 'tradesman_profile')
                
                # Return tokens and user info in response body
                return Response({
                    'access': access_token,
                    'refresh': refresh_token,
                    'is_tradesman': is_tradesman,
                    'email': user.email
                })
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return response

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.query_params.get('refresh_token')
        if not refresh_token:
            return Response({
                'error': 'refresh_token parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate the refresh token
            token = RefreshToken(refresh_token)
            
            # Get the user associated with this token
            user_id = token.payload.get('user_id')
            if not user_id:
                raise serializers.ValidationError('Invalid refresh token')
            
            # Create a new access token
            access_token = token.access_token
            
            return Response({
                'access': str(access_token),
                'user': user_id
            })
        except TokenError as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            # Create response to clear cookies
            response = Response(status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

from .serializers import PasswordResetSerializer, PasswordResetConfirmSerializer

class TokenVerifyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return Response({'error': 'Authorization header is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Extract token from Authorization header (expected format: 'Bearer <token>')
            token_type, token = auth_header.split()
            if token_type.lower() != 'bearer':
                return Response({
                    'error': 'Invalid token type. Expected Bearer token'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Try to verify both access and refresh token
            try:
                access_token = AccessToken(token)
                return Response({
                    'valid': True,
                    'type': 'access',
                    'exp': access_token.payload.get('exp'),
                    'iat': access_token.payload.get('iat'),
                    'user_id': access_token.payload.get('user_id')
                })
            except TokenError:
                refresh_token = RefreshToken(token)
                return Response({
                    'valid': True,
                    'type': 'refresh',
                    'exp': refresh_token.payload.get('exp'),
                    'iat': refresh_token.payload.get('iat'),
                    'user_id': refresh_token.payload.get('user_id')
                })
        except ValueError:
            return Response({
                'error': 'Invalid Authorization header format. Expected: Bearer <token>'
            }, status=status.HTTP_400_BAD_REQUEST)
        except TokenError as e:
            return Response({
                'valid': False,
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Get the user
                user = User.objects.get(email=serializer.validated_data['email'])
                
                # Generate reset link
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = PasswordResetTokenGenerator().make_token(user)
                
                # Get the frontend URL from CORS settings
                frontend_url = settings.CORS_ALLOW_ORIGINS[0]
                reset_link = f"{frontend_url}/password-reset-confirm/{uid}/{token}"
                
                # Create professional email message
                message = f"""
                Hello,

                We received a request to reset your password for your Vakaden account.

                If you did not make this request, please ignore this email.

                To reset your password, please click the following link:
                {reset_link}

                This link will expire in 24 hours.

                Best regards,
                The Vakaden Team
                """
                
                # Send email
                send_mail(
                    'Password Reset Request',
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                
                return Response({
                    'message': 'Password reset email has been sent.'
                }, status=200)
            except User.DoesNotExist:
                return Response({
                    'error': 'User not found'
                }, status=400)
            except Exception as e:
                print(f"Error sending password reset email: {str(e)}")
                return Response({
                    'error': 'Failed to send password reset email. Please try again later.'
                }, status=500)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable JWT authentication for this view

    def get(self, request, uidb64, token):
        """
        Handle GET request to validate token and return uid/token
        This endpoint is used by the frontend to validate the token
        before showing the password reset form
        """
        try:
            # Decode the uid
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            
            # Validate the token
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({
                    'error': 'Invalid or expired token'
                }, status=400)
            
            # Return uid and token for frontend to use
            return Response({
                'uid': uidb64,
                'token': token
            })
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            print(f"Error processing uid: {str(e)}")
            return Response({
                'error': 'Invalid user ID. Please check the reset link and try again.'
            }, status=400)

    def post(self, request, uidb64, token):
        """
        Handle POST request to actually reset the password
        This endpoint is called by the frontend after user submits new password
        """
        try:
            # Get new password from request
            new_password = request.data.get('new_password')
            if not new_password:
                return Response({
                    'error': 'New password is required'
                }, status=400)
            
            # Get user and validate token
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({
                    'error': 'Invalid or expired token'
                }, status=400)
            
            # Set new password
            user.set_password(new_password)
            user.save()
            
            return Response({
                'message': 'Password has been reset successfully'
            }, status=200)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            print(f"Error resetting password: {str(e)}")
            return Response({
                'error': 'Failed to reset password. Please try again.'
            }, status=400)
