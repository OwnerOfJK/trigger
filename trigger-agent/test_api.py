import requests
import json
import time

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
        "message": "What can you tell me about the Base blockchain?",
        "agent_id": "agent1"  # Optional, defaults to agent1 if not specified
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
        
        # Verify response structure
        assert "content" in response_data, "Response missing content"
        assert "agent_id" in response_data, "Response missing agent_id"
        assert "wallet_address" in response_data, "Response missing wallet_address"
        
    except requests.exceptions.JSONDecodeError:
        print(f"Response (raw): {response.text}")

def test_agent_initialization():
    print("\n=== Testing Agent Initialization ===")
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    # Test getting agent info
    response = requests.get(
        'http://localhost:5001/api/agents',
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        response_data = response.json()
        print("Agent Pool:")
        print(json.dumps(response_data, indent=2))
        
        # Verify agent structure
        assert "agent1" in response_data, "Agent1 not found in pool"
        assert "agent2" in response_data, "Agent2 not found in pool"
        assert "wallet_address" in response_data["agent1"], "Agent1 missing wallet address"
        assert "capabilities" in response_data["agent1"], "Agent1 missing capabilities"
    except Exception as e:
        print(f"Error: {str(e)}")

def test_agent_conversation():
    print("\n=== Testing Agent Conversation ===")
    
    conversation_request = {
        "topic": "How much ETH is inside your wallet and my wallet combined?",
        "max_turns": 2
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(
        'http://localhost:5001/api/conversation',
        data=json.dumps(conversation_request),
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        response_data = response.json()
        print("Conversation:")
        print(json.dumps(response_data, indent=2))
        
        # Verify conversation structure
        assert "task_id" in response_data, "Response missing task_id"
        assert "conversation" in response_data, "Response missing conversation"
        
        # Verify conversation content
        conversation = response_data["conversation"]
        assert len(conversation) > 0, "Conversation is empty"
        
        for message in conversation:
            assert "speaker" in message, "Message missing speaker"
            assert "content" in message, "Message missing content"
            assert "wallet" in message, "Message missing wallet address"
            assert "timestamp" in message, "Message missing timestamp"
            
    except Exception as e:
        print(f"Error: {str(e)}")

def test_error_handling():
    print("\n=== Testing Error Handling ===")
    
    # Test missing request
    print("\nTesting missing request...")
    response = requests.post(
        'http://localhost:5001/api/multi-agent-task',
        data=json.dumps({}),
        headers={'Content-Type': 'application/json'}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test invalid JSON
    print("\nTesting invalid JSON...")
    response = requests.post(
        'http://localhost:5001/api/multi-agent-task',
        data="invalid json",
        headers={'Content-Type': 'application/json'}
    )
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.json()}")
    except:
        print(f"Response (raw): {response.text}")

if __name__ == "__main__":
    print("Starting API tests...")
    
    try:
        # Run all tests
        test_home_endpoint()
        # test_chat_endpoint()
        test_agent_conversation()
        # test_error_handling()
        
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server. Make sure the Flask app is running on port 5001.")