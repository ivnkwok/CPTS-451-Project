from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from ..models import UserProfile

class PermissionTests(APITestCase):
    def setUp(self):
        # Create test users with different roles
        self.student = User.objects.create_user(
            username='teststudent',
            email='student@example.com',
            password='testpassword123'
        )
        self.student_profile = UserProfile.objects.create(
            user=self.student,
            role='student',
            student_id='12345',
            balance=100.00
        )

        self.staff = User.objects.create_user(
            username='teststaff',
            email='staff@example.com',
            password='testpassword123'
        )
        self.staff_profile = UserProfile.objects.create(
            user=self.staff,
            role='staff',
            balance=0.00
        )

        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword123'
        )
        self.admin_profile = UserProfile.objects.create(
            user=self.admin,
            role='admin',
            balance=0.00
        )

    def test_student_own_balance_access(self):
        """Test that students can view their own balance"""
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse('own-balance'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['balance']), 100.00)

    def test_staff_balance_access(self):
        """Test that staff can view any student's balance"""
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse('student-balance', kwargs={'student_id': '12345'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['balance']), 100.00)

    def test_student_other_balance_access(self):
        """Test that students cannot view other students' balances"""
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse('student-balance', kwargs={'student_id': '12345'}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_balance_access(self):
        """Test that admins can view any student's balance"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse('student-balance', kwargs={'student_id': '12345'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['balance']), 100.00)

    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access balance information"""
        response = self.client.get(reverse('own-balance'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_student_id(self):
        """Test handling of invalid student ID"""
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse('student-balance', kwargs={'student_id': '99999'}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) 