import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile

def create_test_users():
    # Create staff user
    try:
        staff = User.objects.create_user(
            username='teststaff',
            email='staff@example.com',
            password='testpassword123',
            is_staff=True
        )
        UserProfile.objects.create(
            user=staff,
            role='staff',
            balance=0.00
        )
        print(f"Created staff user: {staff.username}")
        print(f"Email: {staff.email}")
        print(f"Password: testpassword123")
    except Exception as e:
        print(f"Staff user may already exist: {str(e)}")

    # Create student user
    try:
        student = User.objects.create_user(
            username='teststudent',
            email='student@example.com',
            password='testpassword123'
        )
        UserProfile.objects.create(
            user=student,
            role='student',
            student_id='12345',
            balance=100.00
        )
        print(f"\nCreated student user: {student.username}")
        print(f"Email: {student.email}")
        print(f"Password: testpassword123")
        print(f"Student ID: 12345")
    except Exception as e:
        print(f"Student user may already exist: {str(e)}")

    # Create admin user
    try:
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword123'
        )
        UserProfile.objects.create(
            user=admin,
            role='admin',
            balance=0.00
        )
        print(f"\nCreated admin user: {admin.username}")
        print(f"Email: {admin.email}")
        print(f"Password: adminpassword123")
    except Exception as e:
        print(f"Admin user may already exist: {str(e)}")

if __name__ == '__main__':
    print("Creating test users...")
    create_test_users()
    print("\nTest users created successfully!") 