import { useState } from 'react'
import type { Message } from '@/types/chat'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])

      // Send to API
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: content })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Add bot response
      const botMessage: Message = {
        id: data.id,
        content: data.content,
        sender: 'bot',
        timestamp: new Date(data.timestamp * 1000)
      }
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading
  }
}