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

def cleanup_database():
    print("\nCleaning up database...")
    
    # List of test user emails
    test_emails = ['staff@example.com', 'student@example.com', 'admin@example.com']
    
    for email in test_emails:
        # Get all users with this email
        users = User.objects.filter(email=email)
        if users.count() > 1:
            print(f"\nFound {users.count()} users with email {email}")
            # Keep the first user and delete the rest
            keep_user = users.first()
            for user in users[1:]:
                print(f"Deleting duplicate user: {user.username}")
                # Delete the profile first
                try:
                    profile = UserProfile.objects.get(user=user)
                    profile.delete()
                except UserProfile.DoesNotExist:
                    pass
                # Then delete the user
                user.delete()
            print(f"Kept user: {keep_user.username}")
    
    print("\nDatabase cleanup complete!")

if __name__ == '__main__':
    cleanup_database() 