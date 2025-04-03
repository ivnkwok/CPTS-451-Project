import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials

# Initialize Firebase Admin
cred = credentials.Certificate('/app/firebase-admin/firebase-adminsdk.json')
firebase_admin.initialize_app(cred)

def create_test_user():
    # Create Firebase user
    try:
        firebase_user = auth.create_user(
            email='devcontainer@gmail.com',
            password='password',
            display_name='Test Staff'
        )
        print(f"Created Firebase user: {firebase_user.uid}")
    except Exception as e:
        print(f"Firebase user may already exist: {str(e)}")

    # Create Django user
    try:
        student = User.objects.create_user(
            username='teststudent',
            email='teststudent@example.com',
            password='testpassword123'
        )
        
        # Create user profile with balance
        profile = UserProfile.objects.create(
            user=student,
            student_id='12345',
            balance=100.00
        )
        
        print(f"Created Django user:")
        print(f"Username: {student.username}")
        print(f"Email: {student.email}")
        print(f"Student ID: {profile.student_id}")
        print(f"Balance: ${profile.balance}")
    except Exception as e:
        print(f"Django user may already exist: {str(e)}")

if __name__ == '__main__':
    create_test_user() 