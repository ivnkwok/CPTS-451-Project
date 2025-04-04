from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                "message": "Logged in successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                }
            })
        return JsonResponse({"error": "Invalid credentials"}, status=401)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})

def user_view(request):
    if request.user.is_authenticated:
        user = request.user
        return JsonResponse({
            "username": user.username,
            "email": user.email,
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)
