from datetime import datetime
from typing import Dict, Any, List, Optional
import json
import logging

class AgentMessage:
    def __init__(self, sender_id: str, receiver_id: str, content: str, task_id: str, 
                 message_type: str = "general", metadata: Dict[str, Any] = None):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.content = content
        self.task_id = task_id
        self.message_type = message_type
        self.metadata = metadata or {}
        self.timestamp = datetime.now()
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "speaker": self.sender_id,
            "content": self.content,
            "wallet": self.metadata.get("wallet_address", ""),
            "timestamp": self.timestamp.isoformat(),
            "task_id": self.task_id,
            "message_type": self.message_type
        }

class AgentCommunicationLog:
    def __init__(self):
        self.messages: List[AgentMessage] = []
    
    def add_message(self, message: AgentMessage):
        self.messages.append(message)
    
    def get_recent_messages(self, limit: int = 5) -> List[AgentMessage]:
        return sorted(self.messages, key=lambda x: x.timestamp, reverse=True)[:limit]