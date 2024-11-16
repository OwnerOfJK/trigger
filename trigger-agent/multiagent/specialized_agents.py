from .base_agent import BaseAgent
from .communication import AgentMessage
from typing import Optional
import uuid
from swarm import Swarm
from agents import based_agent
from datetime import datetime
import logging
import json

logger = logging.getLogger(__name__)

class ConversationalAgent(BaseAgent):
    def __init__(self, agent_number: int):
        super().__init__(
            agent_id=f"agent{agent_number}",  # Changed from agent_{uuid} to match pool keys
            name=f"Agent {agent_number}",
            capabilities=["conversation", "token_creation", "fund_management"]
        )
        self.conversation_state = {}
    
    def process_message(self, message: AgentMessage) -> Optional[AgentMessage]:
        try:
            context = "\n".join([
                f"You are {self.name} with wallet address {self.wallet.default_address.address_id}.",
                "You can create tokens and manage funds.",
                f"Previous messages: {self.get_conversation_context()}",
                f"Current conversation state: {json.dumps(self.conversation_state)}",
                "Do not repeat previous questions. Progress the conversation forward."
            ])
            
            if "token" in message.content.lower():
                if "name" not in self.conversation_state:
                    self.conversation_state["stage"] = "collecting_token_details"
                elif all(k in self.conversation_state for k in ["name", "symbol", "supply"]):
                    self.conversation_state["stage"] = "ready_to_deploy"
            
            response = self.swarm_client.run(
                agent=based_agent,
                messages=[{
                    "role": "user", 
                    "content": f"{context}\n\nRespond to: {message.content}"
                }],
                stream=False
            )
            
            if not response or not hasattr(response, 'messages') or not response.messages:
                raise ValueError("Invalid response from swarm client")
            
            reply = response.messages[-1].get("content", "No response generated")
            
            return self.send_message(
                receiver_id=message.sender_id,
                content=reply,
                task_id=message.task_id,
                message_type="conversation"
            )
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return self.send_message(
                receiver_id=message.sender_id,
                content=f"Error processing message: {str(e)}",
                task_id=message.task_id,
                message_type="error"
            )
    
    def send_message(self, receiver_id: str, content: str, task_id: str, message_type: str = "conversation") -> AgentMessage:
        """Send a message to another agent"""
        message = AgentMessage(
            sender_id=self.agent_id,
            receiver_id=receiver_id,
            content=content,
            task_id=task_id,
            message_type=message_type,
            metadata={"wallet_address": self.wallet.default_address.address_id}
        )
        self.comm_log.add_message(message)
        return message
    
    def get_conversation_context(self) -> str:
        """Get recent conversation context"""
        recent_messages = self.comm_log.get_recent_messages(5)
        if not recent_messages:
            return "No previous messages"
        return "\n".join([
            f"{msg.sender_id}: {msg.content}"
            for msg in recent_messages
        ])