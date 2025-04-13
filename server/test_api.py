import requests
import json

def test_api():
    base_url = 'http://localhost:8000'  # Changed from 'http://server:8000' to 'http://localhost:8000'
    users = {
        'staff': {'username': 'staff', 'password': 'staffpass123'},
        'student': {'username': 'student', 'password': 'studentpass123'},
        'admin': {'username': 'admin', 'password': 'adminpass123'}
    }

    def login(username, password):
        response = requests.post(f'{base_url}/auth/login/', 
                               json={'username': username, 'password': password})
        print(f"Login response: {response.status_code} - {response.text}")
        if response.status_code == 200:
            return response.json().get('token')
        return None

    def test_endpoint(endpoint, token):
        headers = {'Authorization': f'Token {token}'} if token else {}
        response = requests.get(f'{base_url}{endpoint}', headers=headers)
        return response.status_code, response.text

    # Test each user
    for role, credentials in users.items():
        print(f"\nTesting {role.upper()} user:")
        print(f"Username: {credentials['username']}")
        print(f"Password: {credentials['password']}")
        token = login(credentials['username'], credentials['password'])
        
        if token:
            print(f"✓ Login successful")
            
            # Test user profile
            status, response = test_endpoint('/users/profile/', token)
            print(f"Profile endpoint: {status}")
            if status == 200:
                print(f"Response: {response}")
            
            # Test balance endpoint
            status, response = test_endpoint('/users/balance/', token)
            print(f"Balance endpoint: {status}")
            if status == 200:
                print(f"Response: {response}")
            
            # Test menu endpoint
            status, response = test_endpoint('/api/menu/', token)
            print(f"Menu endpoint: {status}")
            if status == 200:
                print(f"Response: {response}")
        else:
            print(f"✗ Login failed")

if __name__ == '__main__':
    test_api() 