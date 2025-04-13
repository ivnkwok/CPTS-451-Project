import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile

def create_test_users():
    # Delete existing test users if they exist
    try:
        User.objects.filter(username__in=['staff', 'student', 'admin']).delete()
        print("Deleted existing test users")
    except Exception as e:
        print(f"Error deleting existing users: {e}")

    try:
        # Create staff user
        staff_user = User.objects.create_user(
            username='staff',
            email='staff@example.com',
            password='staffpass123',
            is_staff=True
        )
        staff_profile = staff_user.profile
        staff_profile.role = 'staff'
        staff_profile.balance = 100.00  # Initial balance for staff
        staff_profile.save()
        print(f"Created staff user: {staff_user.username} with role {staff_profile.role} and balance ${staff_profile.balance}")

        # Create student user
        student_user = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='studentpass123'
        )
        student_profile = student_user.profile
        student_profile.role = 'student'
        student_profile.balance = 50.00  # Initial balance for student
        student_profile.save()
        print(f"Created student user: {student_user.username} with role {student_profile.role} and balance ${student_profile.balance}")

        # Create admin user
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True,
            is_superuser=True
        )
        admin_profile = admin_user.profile
        admin_profile.role = 'admin'
        admin_profile.balance = 200.00  # Initial balance for admin
        admin_profile.save()
        print(f"Created admin user: {admin_user.username} with role {admin_profile.role} and balance ${admin_profile.balance}")

    except Exception as e:
        print(f"Error creating test users: {e}")

if __name__ == '__main__':
    create_test_users() 