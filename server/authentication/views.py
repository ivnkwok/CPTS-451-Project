from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer

# Create your views here.

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not password or (not username and not email):
            return Response(
                {'error': 'Please provide either username or email, and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if email:
                # If email is provided, get user by email
                user = User.objects.get(email=email)
                # Then authenticate using username and password
                user = authenticate(username=user.username, password=password)
            else:
                # If username is provided, authenticate directly
                user = authenticate(username=username, password=password)
            
            if not user:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            if not user.is_active:
                return Response(
                    {'error': 'User account is disabled'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            token, _ = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'profile': {
                        'role': user.profile.role if hasattr(user, 'profile') else None,
                        'balance': float(user.profile.balance) if hasattr(user, 'profile') else 0.00,
                        'student_id': user.profile.student_id if hasattr(user, 'profile') else None
                    }
                }
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'No user found with these credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delete the token
        request.auth.delete()
        # Logout the user
        logout(request)
        return Response({'message': 'Successfully logged out'})

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'profile': {
                'role': user.profile.role if hasattr(user, 'profile') else None,
                'balance': float(user.profile.balance) if hasattr(user, 'profile') else 0.00,
                'student_id': user.profile.student_id if hasattr(user, 'profile') else None
            }
        })
