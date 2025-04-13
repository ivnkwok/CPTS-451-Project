from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth.models import User
from .decorators import require_permission
from functools import wraps
from rest_framework import status

# Create your views here.

class UserBalanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, student_id):
        try:
            profile = get_object_or_404(UserProfile, student_id=student_id)
            serializer = UserProfileSerializer(profile)
            return Response({
                'student_id': profile.student_id,
                'balance': profile.balance
            })
        except UserProfile.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)

class StudentBalanceView(APIView):
    @require_permission('view_balance')
    def get(self, request, student_id):
        try:
            student_profile = UserProfile.objects.get(student_id=student_id)
            return Response({
                'student_id': student_profile.student_id,
                'name': student_profile.user.get_full_name() or student_profile.user.username,
                'balance': float(student_profile.balance)
            })
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Student not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class OwnBalanceView(APIView):
    @require_permission('view_own_balance')
    def get(self, request):
        try:
            profile = request.user.profile
            return Response({
                'student_id': profile.student_id,
                'name': request.user.get_full_name() or request.user.username,
                'balance': float(profile.balance)
            })
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
