from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.contrib.auth.models import User
from app.models.models import TradesmanProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_tradesman = serializers.BooleanField(default=False)
    profession = serializers.CharField(required=False)
    experience = serializers.IntegerField(required=False)
    location = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    hourly_rate = serializers.BooleanField(required=False)
    specialties = serializers.CharField(required=False)
    qualifications = serializers.FileField(required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'is_tradesman', 'profession', 'experience', 'location',
                  'qualifications', 'description', 'price', 'hourly_rate', 'specialties')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value

    def create(self, validated_data):
        is_tradesman = validated_data.pop('is_tradesman', False)
        email = validated_data['email']
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password']
        )
        
        # Create tradesman profile if is_tradesman is True
        if is_tradesman:
            tradesman_data = {
                'user': user,
                'profession': validated_data.get('profession'),
                'experience': validated_data.get('experience'),
                'location': validated_data.get('location'),
                'qualifications': validated_data.get('qualifications'),
                'description': validated_data.get('description'),
                'price': validated_data.get('price'),
                'hourly_rate': validated_data.get('hourly_rate', True),
                'specialties': validated_data.get('specialties')
            }
            
            # Remove None values
            tradesman_data = {k: v for k, v in tradesman_data.items() if v is not None}
            
            TradesmanProfile.objects.create(**tradesman_data)
        
        return user

class TradesmanRegistrationSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()

    class Meta:
        model = TradesmanProfile
        fields = ['user', 'profession', 'experience', 'location',
                  'qualifications', 'description', 'price', 'hourly_rate', 'specialties']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['is_tradesman'] = True
        user = RegisterSerializer().create(user_data)
        tradesman = TradesmanProfile.objects.create(user=user, **validated_data)
        return tradesman

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with that email.")
        return value

    def save(self):
        user = User.objects.get(email=self.validated_data['email'])
        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"http://localhost:8000/password-reset-confirm/{uid}/{token}"
        send_mail(
            subject="Password Reset",
            message=f"Reset your password using the following link: {reset_url}",
            from_email=None,
            recipient_list=[user.email],
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField()

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token")

        if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid or expired token")

        user.set_password(attrs['new_password'])
        user.save()
        return attrs
