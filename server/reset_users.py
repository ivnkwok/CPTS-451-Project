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

def reset_users():
    print("\nResetting test users...")
    
    # List of test emails
    test_emails = ['staff@example.com', 'student@example.com', 'admin@example.com']
    
    # Delete all test users and their profiles
    for email in test_emails:
        users = User.objects.filter(email=email)
        for user in users:
            print(f"Deleting user: {user.username}")
            try:
                profile = UserProfile.objects.get(user=user)
                profile.delete()
            except UserProfile.DoesNotExist:
                pass
            user.delete()
    
    print("\nAll test users have been removed!")

if __name__ == '__main__':
    reset_users() 