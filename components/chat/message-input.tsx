'use client'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useStore as useChatStore } from '@/lib/stores/chat'
import { useStore as useAgentStore } from '@/lib/stores/agents'

export function MessageInput() {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const addMessage = useChatStore((state) => state.addMessage)
  const simulateAgentResponse = useChatStore((state) => state.simulateAgentResponse)
  const { startProcessing } = useAgentStore()

  const handleSubmit = () => {
    if (!message.trim()) return

    // Add user message
    addMessage({
      role: 'user',
      content: message.trim(),
    })

    // Start agent processing
    startProcessing()

    // Simulate agent responses in sequence
    const agents = ['document-agent', 'technical-agent', 'compliance-agent', 'cost-agent']
    agents.forEach((agentId, index) => {
      // Initial response
      setTimeout(() => {
        simulateAgentResponse(agentId, 0)
      }, index * 4000)

      // Final response with results
      setTimeout(() => {
        simulateAgentResponse(agentId, 1)
      }, index * 4000 + 2000)
    })

    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[200px] resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="h-[60px] w-[60px]"
          onClick={handleSubmit}
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}