import { create } from 'zustand'
import { type Message } from '@/lib/types/chat'

interface ChatStore {
  messages: Message[]
  isTyping: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setTyping: (isTyping: boolean) => void
  simulateAgentResponse: (agentId: string, responseIndex: number) => void
}

const agentResponses: Record<string, string[]> = {
  'document-agent': [
    "I'll start creating the project documentation for your luxury deck project. Let me gather the necessary details and prepare the initial documents.",
    "I've created the following documents:\n\n1. Project Specification\n- Custom deck design with gold-plated structural elements\n- Diamond-encrusted decorative features\n- Premium weatherproof coating\n\n2. Material List\n- 24k gold plating\n- VS1 clarity diamonds\n- Premium hardwood base\n\nPassing these to the Technical Validation Agent for review."
  ],
  'technical-agent': [
    "Analyzing the technical specifications and structural requirements...",
    "Technical Analysis Complete:\n- Gold plating thickness: 2.5mm (optimal for durability)\n- Diamond setting specifications verified\n- Structural integrity calculations completed\n- Weather resistance requirements met\n\nForwarding to Compliance Agent for regulatory review."
  ],
  'compliance-agent': [
    "Reviewing compliance with local building codes and luxury material regulations...",
    "Compliance Review Results:\n- Building permit requirements identified\n- Precious metals handling permits required\n- Security measures compliance verified\n- Insurance requirements determined\n\nSending to Cost Analysis Agent for budget calculation."
  ],
  'cost-agent': [
    "Calculating project costs and preparing detailed budget...",
    "Budget Breakdown:\n1. Materials:\n- Gold plating: $2.8M\n- Diamonds (VS1): $1.5M\n- Premium hardwood: $50K\n\n2. Labor:\n- Specialized installation: $200K\n- Security: $100K\n\n3. Permits & Insurance: $150K\n\nTotal Estimated Cost: $4.8M\n\nNote: Prices subject to market fluctuations."
  ]
}

export const useStore = create<ChatStore>((set) => ({
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
  simulateAgentResponse: (agentId: string, responseIndex: number) => {
    if (!agentResponses[agentId]?.[responseIndex]) return

    set({ isTyping: true })
    
    setTimeout(() => {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: agentResponses[agentId][responseIndex],
            timestamp: Date.now(),
          },
        ],
        isTyping: false,
      }))
    }, 1000)
  },
}))