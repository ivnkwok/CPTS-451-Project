from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
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
            "is_staff": user.is_staff,
            "groups": list(user.groups.values_list('name', flat=True)),
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)

@method_decorator(csrf_exempt, name='dispatch')
class signup_view(APIView):
    """
    Handles user signup by creating a new User.
    Accepts username, email, password, and role ('student', 'staff', or 'admin').
    """
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'student')

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password)
            )
        except Exception as e:
            return Response(
                {"error": f"Error creating user: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if role in ['admin', 'staff', 'student']:
            group, _ = Group.objects.get_or_create(name=role)
            user.groups.add(group)
            if role == 'staff':
                user.is_staff = True
            elif role == 'admin':
                user.is_staff = True
                user.is_superuser = True
        else:
            return Response(
                {"error": "Invalid role specified."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )
