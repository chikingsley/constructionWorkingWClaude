'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/lib/stores/chat'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function MessageInput() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const {
    isTyping,
    activeAgents,
    error,
    addMessage,
    setTyping,
    setError
  } = useChatStore()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const message = input.trim()
    setInput('')
    setTyping(true)
    setError(null)

    try {
      if (window.socket?.readyState === WebSocket.OPEN) {
        window.socket.send(JSON.stringify({
          type: 'message',
          data: {
            content: message,
            source: 'frontend'
          }
        }))
        addMessage({
          content: message,
          role: 'user'
        })
      } else {
        throw new Error('WebSocket is not connected')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      setTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isTyping ? "Waiting for response..." : "Send a message..."}
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-background px-3 py-2"
          disabled={isTyping}
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="w-24"
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <span className="animate-pulse">•••</span>
            </div>
          ) : (
            'Send'
          )}
        </Button>
      </form>
      
      {activeAgents.size > 0 && (
        <div className="text-sm text-muted-foreground">
          Active agents: {Array.from(activeAgents).join(', ')}
        </div>
      )}
    </div>
  )
}
