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

def check_users():
    print("\nChecking users in database...")
    
    # Check staff user
    try:
        staff_users = User.objects.filter(email='staff@example.com')
        if staff_users.exists():
            print(f"\nFound {staff_users.count()} staff user(s):")
            for user in staff_users:
                try:
                    profile = UserProfile.objects.get(user=user)
                    print(f"\nStaff User:")
                    print(f"Username: {user.username}")
                    print(f"Email: {user.email}")
                    print(f"Role: {profile.role}")
                    print(f"Balance: {profile.balance}")
                    print(f"Is Staff: {user.is_staff}")
                except UserProfile.DoesNotExist:
                    print(f"\nStaff user {user.username} exists but profile is missing!")
        else:
            print("\nNo staff users found!")
    except Exception as e:
        print(f"\nError checking staff users: {str(e)}")

    # Check student user
    try:
        student_users = User.objects.filter(email='student@example.com')
        if student_users.exists():
            print(f"\nFound {student_users.count()} student user(s):")
            for user in student_users:
                try:
                    profile = UserProfile.objects.get(user=user)
                    print(f"\nStudent User:")
                    print(f"Username: {user.username}")
                    print(f"Email: {user.email}")
                    print(f"Role: {profile.role}")
                    print(f"Balance: {profile.balance}")
                    print(f"Student ID: {profile.student_id}")
                    print(f"Is Staff: {user.is_staff}")
                except UserProfile.DoesNotExist:
                    print(f"\nStudent user {user.username} exists but profile is missing!")
        else:
            print("\nNo student users found!")
    except Exception as e:
        print(f"\nError checking student users: {str(e)}")

    # Check admin user
    try:
        admin_users = User.objects.filter(email='admin@example.com')
        if admin_users.exists():
            print(f"\nFound {admin_users.count()} admin user(s):")
            for user in admin_users:
                try:
                    profile = UserProfile.objects.get(user=user)
                    print(f"\nAdmin User:")
                    print(f"Username: {user.username}")
                    print(f"Email: {user.email}")
                    print(f"Role: {profile.role}")
                    print(f"Balance: {profile.balance}")
                    print(f"Is Staff: {user.is_staff}")
                    print(f"Is Superuser: {user.is_superuser}")
                except UserProfile.DoesNotExist:
                    print(f"\nAdmin user {user.username} exists but profile is missing!")
        else:
            print("\nNo admin users found!")
    except Exception as e:
        print(f"\nError checking admin users: {str(e)}")

if __name__ == '__main__':
    check_users() 