from django.contrib.auth.models import User
from django.db import models
import json
from datetime import datetime
from django.utils import timezone


# We'll use Django's built-in User model for authentication
# Custom user-related models can be added here if needed
class TradesmanProfile(models.Model):
    PROFESSIONS = [
        ('electrician', 'Electrician'),
        ('plumber', 'Plumber'),
        ('builder', 'Builder'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tradesman_profile')
    profession = models.CharField(max_length=30, choices=PROFESSIONS)
    experience = models.PositiveIntegerField()
    location = models.CharField(max_length=100)
    qualifications = models.FileField(upload_to='qualifications/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    hourly_rate = models.BooleanField(default=True)  # True = per hour, False = fixed
    specialties = models.CharField(max_length=255, blank=True)
    is_approved = models.BooleanField(default=False)  # New field for approval status

    def __str__(self):
        return f"{self.user.email} - {self.profession}"



class StripeCheckoutSession(models.Model):
    id = models.CharField(max_length=255, primary_key=True)  # Stripe session ID
    object_type = models.CharField(max_length=50, default='checkout.session')

    amount_subtotal = models.IntegerField()
    amount_total = models.IntegerField()

    automatic_tax_enabled = models.BooleanField(default=False)

    created = models.DateTimeField()
    expires_at = models.DateTimeField()

    currency = models.CharField(max_length=10)

    customer_creation = models.CharField(max_length=50, null=True, blank=True)
    livemode = models.BooleanField(default=False)

    mode = models.CharField(max_length=20)
    payment_method_collection = models.CharField(max_length=20, null=True, blank=True)
    payment_method_types = models.TextField(default='[]')  # Store as JSON string
    payment_status = models.CharField(max_length=20)

    status = models.CharField(max_length=20)

    success_url = models.URLField(max_length=1000)
    url = models.URLField(max_length=1000)

    client_reference_id = models.CharField(max_length=255, null=True, blank=True)
    customer = models.CharField(max_length=255, null=True, blank=True)
    customer_email = models.EmailField(null=True, blank=True)
    invoice = models.CharField(max_length=255, null=True, blank=True)
    payment_intent = models.CharField(max_length=255, null=True, blank=True)
    subscription = models.CharField(max_length=255, null=True, blank=True)

    invoice_creation_enabled = models.BooleanField(default=False)
    invoice_creation_data = models.TextField(default='{}', blank=True)  # Store as JSON string

    metadata = models.TextField(default='{}', blank=True)  # Store as JSON string

    def get_payment_method_types(self):
        return json.loads(self.payment_method_types)

    def set_payment_method_types(self, types):
        self.payment_method_types = json.dumps(types)

    def get_metadata(self):
        return json.loads(self.metadata)

    def set_metadata(self, data):
        self.metadata = json.dumps(data)

    def __str__(self):
        return f"StripeCheckoutSession({self.id})"

    @classmethod
    def from_stripe_payload(cls, data):
        return cls(
            id=data["id"],
            amount_subtotal=data["amount_subtotal"],
            amount_total=data["amount_total"],
            automatic_tax_enabled=data.get("automatic_tax", {}).get("enabled", False),
            created=timezone.make_aware(datetime.fromtimestamp(data["created"])),
            expires_at=timezone.make_aware(datetime.fromtimestamp(data["expires_at"])),
            currency=data["currency"],
            customer_creation=data.get("customer_creation"),
            livemode=data.get("livemode", False),
            mode=data["mode"],
            payment_method_collection=data.get("payment_method_collection"),
            payment_method_types=json.dumps(data.get("payment_method_types", [])),
            payment_status=data["payment_status"],
            status=data["status"],
            success_url=data["success_url"],
            url=data["url"],
            client_reference_id=data.get("client_reference_id"),
            customer=data.get("customer"),
            customer_email=data.get("customer_email"),
            invoice=data.get("invoice"),
            payment_intent=data.get("payment_intent"),
            subscription=data.get("subscription"),
            invoice_creation_enabled=data.get("invoice_creation", {}).get("enabled", False),
            invoice_creation_data=json.dumps(data.get("invoice_creation", {}).get("invoice_data", {})),
            metadata=json.dumps(data.get("metadata", {})),
        )


class UserSession(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.session_key}"
