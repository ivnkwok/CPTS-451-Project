import requests
import json

# Test user credentials
TEST_USER = {
    'email': 'devcontainer@gmail.com',
    'password': 'password'
}

def get_auth_token():
    # Get Firebase auth token
    response = requests.post(
        'http://localhost:8000/api/auth/login/',
        json=TEST_USER
    )
    return response.json().get('token')

def test_balance_check(student_id):
    token = get_auth_token()
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        f'http://localhost:8000/api/users/balance/{student_id}/',
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == '__main__':
    # Test with the student ID we created
    test_balance_check('12345') 