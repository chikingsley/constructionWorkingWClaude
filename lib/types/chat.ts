export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
}