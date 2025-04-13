import os
import sys
import time
import requests
from requests.exceptions import ConnectionError

def wait_for_server(url, max_retries=30, retry_delay=1):
    """Wait for the server to become available"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code < 500:
                return True
        except ConnectionError:
            pass
        if attempt < max_retries - 1:
            print(f"Server not ready, retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
            time.sleep(retry_delay)
    return False

def run_tests():
    # Get environment variables
    base_url = os.getenv('API_URL', 'http://server:8000/api')
    test_users = {
        'staff': {
            'email': os.getenv('STAFF_EMAIL', 'staff@example.com'),
            'password': os.getenv('STAFF_PASSWORD', 'testpassword123')
        },
        'student': {
            'email': os.getenv('STUDENT_EMAIL', 'student@example.com'),
            'password': os.getenv('STUDENT_PASSWORD', 'testpassword123')
        },
        'admin': {
            'email': os.getenv('ADMIN_EMAIL', 'admin@example.com'),
            'password': os.getenv('ADMIN_PASSWORD', 'adminpassword123')
        }
    }

    print("\nStarting Docker Tests")
    print("====================")

    # Wait for server to be ready
    if not wait_for_server(f"{base_url}/auth/login/"):
        print("Error: Could not connect to the server")
        sys.exit(1)

    print("\nTesting Balance Access for Different Roles")
    print("=========================================")

    for role, credentials in test_users.items():
        print(f"\nTesting as {role}:")
        
        # Get authentication token
        try:
            response = requests.post(
                f"{base_url}/auth/login/",
                json={'email': credentials['email'], 'password': credentials['password']},
                timeout=5
            )
            if response.status_code != 200:
                print(f"Authentication failed: {response.status_code} - {response.text}")
                continue
            token = response.json()['token']
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            continue

        headers = {
            'Authorization': f'Token {token}',
            'Content-Type': 'application/json'
        }

        # Test viewing own balance
        print("\n1. Testing viewing own balance:")
        try:
            response = requests.get(f"{base_url}/users/balance/", headers=headers, timeout=5)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"Balance: ${response.json()['balance']}")
            else:
                print(f"Error: {response.json().get('error', 'Unknown error')}")
        except Exception as e:
            print(f"Error testing own balance: {str(e)}")

        # Test viewing other student's balance
        print("\n2. Testing viewing other student's balance:")
        try:
            response = requests.get(
                f"{base_url}/users/balance/12345/",
                headers=headers,
                timeout=5
            )
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"Student Balance: ${response.json()['balance']}")
            else:
                print(f"Error: {response.json().get('error', 'Unknown error')}")
        except Exception as e:
            print(f"Error testing student balance: {str(e)}")

if __name__ == '__main__':
    run_tests() 