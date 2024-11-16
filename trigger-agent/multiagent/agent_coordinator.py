from typing import Dict, List
from .base_agent import BaseAgent
from .communication import AgentMessage
import uuid
import time
import logging
import datetime
import random

logger = logging.getLogger(__name__)

class AgentCoordinator:
    def __init__(self, agents):
        self.agents = agents
        self.follow_up_questions = [
            "What are your thoughts about that?",
            "How do you feel about this topic?",
            "Can you tell me more about your perspective?",
            "What's your experience with this?",
            "Do you see any alternatives?",
            "What questions do you have about this?"
        ]

    def coordinate_conversation(self, topic, max_turns=3):
        conversation = []
        current_turn = 0
        task_id = f"task_{uuid.uuid4().hex[:8]}"
        
        # Start conversation with a question about the topic
        current_message = f"What are your thoughts about {topic}?"
        
        while current_turn < max_turns:
            for agent_id, agent in self.agents.items():  # Use items() since agents is a dict
                timestamp = datetime.datetime.now().isoformat()
                
                # Add the message to conversation
                conversation.append({
                    "content": current_message,
                    "speaker": agent_id,
                    "timestamp": timestamp,
                    "task_id": task_id,
                    "message_type": "conversation",
                    "wallet": agent.wallet.default_address.address_id
                })
                
                # Get response from agent
                response = agent.process_message(AgentMessage(
                    sender_id="coordinator",
                    receiver_id=agent_id,
                    content=current_message,
                    task_id=task_id,
                    message_type="conversation"
                ))
                
                # Add a follow-up question if response doesn't end with one
                if not response.content.strip().endswith('?'):
                    follow_up = random.choice(self.follow_up_questions)
                    current_message = f"{response.content} {follow_up}"
                else:
                    current_message = response.content
                
            current_turn += 1
            
        return {
            "conversation": conversation,
            "final_state": {},
            "status": "completed",
            "task_id": task_id
        }