from django.http import HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import json
from django.contrib.sessions.models import Session
from django.utils.timezone import now
from app.models.models import UserSession

@method_decorator(csrf_exempt, name='dispatch')
class IndexView(View):
    def get(self, request):
        return HttpResponse("Hello, world.", status=200)
