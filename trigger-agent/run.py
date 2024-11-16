from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from swarm import Swarm
from agents import based_agent

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "OPTIONS"],  # Added GET
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

@app.route('/')
def home():
    return jsonify({
        "status": "running",
        "message": "EthAgent API is running. Use /api/chat endpoint for chat functionality."
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        client = Swarm()
        response = client.run(
            agent=based_agent,
            messages=[{"role": "user", "content": message}],
            stream=False
        )
        
        # Extract the last message from the response
        if hasattr(response, 'messages') and response.messages:
            last_message = response.messages[-1]
            return jsonify({
                "content": last_message.get("content", ""),
                "id": str(time.time()),
                "timestamp": time.time(),
                "sender": last_message.get("sender", "bot")
            })
        else:
            return jsonify({
                "error": "No response generated"
            }), 500
            
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting TriggerAgent API...")
    app.run(port=5001, debug=True)