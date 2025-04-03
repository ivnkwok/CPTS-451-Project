from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import UserProfile
from .serializers import UserProfileSerializer

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
