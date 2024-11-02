'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/lib/stores/chat';
import { Message } from './message'

export function MessageList() {
  const messages = useChatStore((state) => state.messages)
  const currentStream = useChatStore((state) => state.currentStream)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentStream])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {currentStream && (
        <Message
          message={{
            id: 'stream',
            content: currentStream,
            role: 'assistant',
            timestamp: Date.now()
          }}
        />
      )}
      
      <div ref={bottomRef} />
    </div>
  )
}