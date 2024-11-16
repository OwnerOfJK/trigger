import requests
import json

def test_home_endpoint():
    print("\n=== Testing Home Endpoint ===")
    print("Sending GET request to http://localhost:5001/")
    
    headers = {
        'Accept': 'application/json'
    }
    
    response = requests.get('http://localhost:5001/', headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    try:
        print(f"Response: {response.json()}")
    except requests.exceptions.JSONDecodeError:
        print(f"Response (raw): {response.text}")

def test_chat_endpoint():
    print("\n=== Testing Chat Endpoint ===")
    
    # Test payload
    payload = {
        "message": "What can you tell me about the Base blockchain?"
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    print(f"Sending request with payload: {payload}")
    response = requests.post(
        'http://localhost:5001/api/chat',
        data=json.dumps(payload),
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        response_data = response.json()
        print(f"Response: {json.dumps(response_data, indent=2)}")
    except requests.exceptions.JSONDecodeError:
        print(f"Response (raw): {response.text}")

if __name__ == "__main__":
    print("Starting API tests...")
    
    try:
        # Test both endpoints
        test_home_endpoint()
        test_chat_endpoint()
        
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server. Make sure the Flask app is running on port 5001.")