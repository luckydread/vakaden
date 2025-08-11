from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {
            'email': {
                'error_messages': {
                    'unique': 'This email address is already registered. Please use a different email or log in if you already have an account.'
                }
            }
        }

    def validate(self, data):
        email = data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                'error': 'This email address is already registered. Please use a different email or log in if you already have an account.'
            })
        return data

    def create(self, validated_data):
        # Use email as username
        email = validated_data['email']
        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password']
        )
        return user

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = value
        if User.objects.filter(email=email).exists():
            return email
        raise serializers.ValidationError('User with this email does not exist.')