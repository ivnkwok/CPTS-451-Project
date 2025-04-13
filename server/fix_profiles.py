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

def fix_profiles():
    print("\nFixing user profiles...")
    
    # Fix staff user profile
    try:
        staff_user = User.objects.get(email='staff@example.com')
        staff_profile = UserProfile.objects.get(user=staff_user)
        staff_profile.role = 'staff'
        staff_profile.save()
        print("Fixed staff user profile")
    except (User.DoesNotExist, UserProfile.DoesNotExist) as e:
        print(f"Error fixing staff profile: {str(e)}")

    # Fix student user profile
    try:
        student_user = User.objects.get(email='student@example.com')
        student_profile = UserProfile.objects.get(user=student_user)
        student_profile.role = 'student'
        student_profile.student_id = 'S12345'
        student_profile.balance = 100
        student_profile.save()
        print("Fixed student user profile")
    except (User.DoesNotExist, UserProfile.DoesNotExist) as e:
        print(f"Error fixing student profile: {str(e)}")

    # Fix admin user profile
    try:
        admin_user = User.objects.get(email='admin@example.com')
        admin_profile = UserProfile.objects.get(user=admin_user)
        admin_profile.role = 'admin'
        admin_profile.save()
        print("Fixed admin user profile")
    except (User.DoesNotExist, UserProfile.DoesNotExist) as e:
        print(f"Error fixing admin profile: {str(e)}")

    print("\nProfile fixes complete!")

if __name__ == '__main__':
    fix_profiles() 