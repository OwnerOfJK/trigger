from typing import List, Dict, Any, Optional
from datetime import datetime
from .communication import AgentMessage, AgentCommunicationLog
from swarm import Swarm
from agents import get_or_create_wallet, based_agent
import os
import logging

WALLET_SEED_FILE = "wallet_seed.json"

logger = logging.getLogger(__name__)

class BaseAgent:
    def __init__(self, agent_id: str, name: str, capabilities: List[str]):
        try:
            self.agent_id = agent_id
            self.name = name
            self.capabilities = capabilities
            self.comm_log = AgentCommunicationLog()
            self.swarm_client = Swarm()
            
            # Initialize wallet
            self.wallet = get_or_create_wallet(f"wallet_seed_{agent_id}")
            logger.info(f"Agent {self.name} initialized with wallet: {self.wallet.default_address.address_id}")
        except Exception as e:
            logger.error(f"Failed to initialize agent {name}: {str(e)}")
            raise
    
    def process_message(self, message: AgentMessage) -> Optional[AgentMessage]:
        """Base message processing method"""
        response = self.swarm_client.run(
            agent=based_agent,
            messages=[{"role": "user", "content": message}],
            stream=False
        )
        return response.messages[-1].get("content", "") if hasattr(response, 'messages') else ""
    
    def send_message(self, receiver_id: str, content: str, task_id: str, message_type: str = "general") -> AgentMessage:
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