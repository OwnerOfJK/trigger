from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import logging
from swarm import Swarm
from agents import based_agent
from multiagent.agent_coordinator import AgentCoordinator
from multiagent.specialized_agents import ConversationalAgent
from multiagent.communication import AgentMessage
import uuid


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "OPTIONS"],  # Added GET
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

try:
    # Initialize agent pool at startup
    agent_pool = {
        'agent1': ConversationalAgent(1),
        'agent2': ConversationalAgent(2)
    }
    
    # Initialize coordinator with agent pool
    coordinator = AgentCoordinator(agent_pool)
except Exception as e:
    logger.error(f"Failed to initialize agents: {str(e)}")
    raise

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        agent_id = data.get('agent_id', 'agent1')  # Default to agent1 if not specified
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
            
        agent = agent_pool[agent_id]
        
        # Create an AgentMessage object instead of passing raw string
        message_obj = AgentMessage(
            sender_id="user",
            receiver_id=agent_id,
            content=message,
            task_id=str(uuid.uuid4()),
            message_type="conversation"
        )
        
        response = agent.process_message(message_obj)
        
        return jsonify({
            "content": response.content,
            "agent_id": agent_id,
            "wallet_address": agent.wallet.default_address.address_id
        })
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/api/multi-agent-task', methods=['POST'])
def multi_agent_task():
    try:
        data = request.json
        request_data = data.get('request')
        
        if not request_data:
            return jsonify({"error": "No request provided"}), 400
            
        result = coordinator.coordinate_task(request_data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in multi-agent task: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return jsonify({
        "status": "running",
        "message": "TriggerAgent API is running",
        "version": "1.0.0",
        "endpoints": ["/api/chat", "/api/conversation", "/api/agents"]
    })

@app.route('/api/agents', methods=['GET'])
def get_agents():
    return jsonify({
        agent_id: {
            "name": agent.name,
            "wallet_address": agent.wallet.default_address.address_id,
            "capabilities": agent.capabilities
        } for agent_id, agent in agent_pool.items()
    })

@app.route('/api/conversation', methods=['POST'])
def start_conversation():
    try:
        data = request.json
        topic = data.get('topic')
        max_turns = data.get('max_turns', 5)
        
        if not topic:
            return jsonify({"error": "No topic provided"}), 400
            
        # Pass additional parameters to coordinate_conversation
        result = coordinator.coordinate_conversation(
            topic, 
            max_turns,
        )
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in conversation: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    logger.info("Starting TriggerAgent API on port 5001...")
    app.run(port=5001, debug=True)