import { create } from 'zustand'
import { type Message } from '@/lib/types/chat'
import { useStore as useAgentStore } from './agents'

interface ChatStore {
  messages: Message[]
  isTyping: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setTyping: (isTyping: boolean) => void
  sendMessage: (content: string) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),
  setTyping: (isTyping) => set({ isTyping }),
  sendMessage: (content: string) => {
    // Add user message
    get().addMessage({
      role: 'user',
      content: content.trim(),
    })

    // Get the WebSocket from agent store
    const socket = useAgentStore.getState().socket
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      set({ isTyping: true })
      
      try {
        // Send message to orchestration agent
        socket.send(JSON.stringify({
          message: content,
          source_agent: 'frontend',
          target_agent: 'orchestration-agent'
        }))
      } catch (error) {
        console.error('Error sending message:', error)
        set({ isTyping: false })
        get().addMessage({
          role: 'system',
          content: 'Error sending message. Please try again.'
        })
      }
    } else {
      console.error('WebSocket is not connected')
      get().addMessage({
        role: 'system',
        content: 'Not connected to server. Please try again.'
      })
    }
  }
}))