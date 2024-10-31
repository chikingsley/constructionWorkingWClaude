'use client'

import { useEffect, useRef } from 'react'
import { useStore } from '@/lib/stores/chat'
import { ChatMessage } from './message'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MessageList() {
  const messages = useStore((state) => state.messages)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}