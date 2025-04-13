import requests
import json
import sys
import time
from requests.exceptions import ConnectionError

BASE_URL = 'http://localhost:8000/api'
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

def wait_for_server():
    """Wait for the server to become available"""
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(f'{BASE_URL}/auth/login/')
            return True
        except ConnectionError:
            if attempt < MAX_RETRIES - 1:
                print(f"Server not ready, retrying in {RETRY_DELAY} seconds... (Attempt {attempt + 1}/{MAX_RETRIES})")
                time.sleep(RETRY_DELAY)
            else:
                print("Error: Could not connect to the server. Please make sure the Django server is running.")
                return False

def get_auth_token(email, password):
    try:
        response = requests.post(
            f'{BASE_URL}/auth/login/',
            json={'email': email, 'password': password},
            timeout=5  # Add timeout to prevent hanging
        )
        if response.status_code == 200:
            return response.json()['token']
        print(f"Authentication failed: {response.status_code} - {response.text}")
        return None
    except ConnectionError as e:
        print(f"Connection error during authentication: {str(e)}")
        return None
    except Exception as e:
        print(f"Unexpected error during authentication: {str(e)}")
        return None

def test_balance_access():
    if not wait_for_server():
        return

    test_users = {
        'staff': {
            'email': 'staff@example.com',
            'password': 'testpassword123'
        },
        'student': {
            'email': 'student@example.com',
            'password': 'testpassword123'
        },
        'admin': {
            'email': 'admin@example.com',
            'password': 'adminpassword123'
        }
    }

    print("\nTesting Balance Access for Different Roles")
    print("=========================================")

    for role, credentials in test_users.items():
        print(f"\nTesting as {role}:")
        token = get_auth_token(credentials['email'], credentials['password'])
        
        if not token:
            print(f"Failed to authenticate as {role}")
            continue

        headers = {
            'Authorization': f'Token {token}',
            'Content-Type': 'application/json'
        }

        try:
            # Test viewing own balance
            print("\n1. Testing viewing own balance:")
            response = requests.get(f'{BASE_URL}/users/balance/', headers=headers, timeout=5)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"Balance: ${response.json()['balance']}")
            else:
                print(f"Error: {response.json().get('error', 'Unknown error')}")

            # Test viewing other student's balance
            print("\n2. Testing viewing other student's balance:")
            response = requests.get(
                f'{BASE_URL}/users/balance/12345/',
                headers=headers,
                timeout=5
            )
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"Student Balance: ${response.json()['balance']}")
            else:
                print(f"Error: {response.json().get('error', 'Unknown error')}")

        except ConnectionError as e:
            print(f"Connection error: {str(e)}")
        except Exception as e:
            print(f"Unexpected error: {str(e)}")

def main():
    try:
        test_balance_access()
    except Exception as e:
        print(f"Error during testing: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main() 