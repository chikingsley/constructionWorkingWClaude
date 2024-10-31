'use client'

import { MessageList } from './message-list'
import { MessageInput } from './message-input'

export function Chat() {
  return (
    <div className="flex h-full w-[400px] flex-col border-l">
      <MessageList />
      <MessageInput />
    </div>
  )
}