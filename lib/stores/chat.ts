import { create } from 'zustand'
import { type Message } from '@/lib/types/chat'

declare global {
  interface Window {
    socket: WebSocket | null;
  }
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws/frontend'

const initializeWebSocket = (onMessage: (data: any) => void) => {
  if (typeof window !== 'undefined') {
    window.socket = new WebSocket(WEBSOCKET_URL);
    
    window.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    window.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    window.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    window.socket.onclose = () => {
      console.log('WebSocket disconnected');
      window.socket = null;
      // Attempt to reconnect after a delay
      setTimeout(() => initializeWebSocket(onMessage), 5000);
    };
  }
};

export const useChatStore = create<{
  messages: Message[];
  isTyping: boolean;
  activeAgents: Set<string>;
  currentStream: string;
  error: string | null;
  addMessage: (message: Partial<Message>) => void;
  setTyping: (isTyping: boolean) => void;
  setActiveAgent: (agentId: string, active: boolean) => void;
  appendToStream: (text: string) => void;
  finalizeStream: () => void;
  setError: (error: string | null) => void;
}>((set, get) => {
  // Initialize WebSocket with message handler
  if (typeof window !== 'undefined') {
    initializeWebSocket((data) => {
      switch (data.type) {
        case 'stream':
          get().appendToStream(data.data.message);
          break;
        case 'progress':
          get().setActiveAgent(data.source, true);
          break;
        case 'response':
          get().setActiveAgent(data.source, false);
          if (get().currentStream) {
            get().finalizeStream();
          }
          break;
        case 'error':
          get().setActiveAgent(data.source, false);
          get().setError(data.data.message);
          break;
      }
    });
  }

  return {
    messages: [],
    isTyping: false,
    activeAgents: new Set<string>(),
    currentStream: '',
    error: null,

    addMessage: (message) =>
      set((state) => {
        const newMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          role: message.role || 'user', // Ensure role is defined
          content: message.content || '', // Ensure content is defined
          status: message.status || 'sent' // Ensure status is defined
        };
        return {
          messages: [...state.messages, newMessage]
        };
      }),

    setTyping: (isTyping) => set({ isTyping }),

    setActiveAgent: (agentId, active) =>
      set((state) => {
        const newActiveAgents = new Set(state.activeAgents);
        if (active) {
          newActiveAgents.add(agentId);
        } else {
          newActiveAgents.delete(agentId);
        }
        return { activeAgents: newActiveAgents };
      }),

    appendToStream: (content) =>
      set((state) => ({
        currentStream: state.currentStream + content,
      })),

    finalizeStream: () =>
      set((state) => {
        if (state.currentStream) {
          return {
            messages: [
              ...state.messages,
              {
                id: crypto.randomUUID(),
                content: state.currentStream,
                role: 'assistant',
                timestamp: Date.now(),
              },
            ],
            currentStream: '',
            isTyping: false,
          };
        }
        return state;
      }),

    setError: (error) => set({ error }),
    
    clearMessages: () => set({ 
      messages: [], 
      currentStream: '', 
      error: null 
    }),

    sendMessage: async (content: string) => {
      try {
        set({ isTyping: true, error: null });
        
        if (!window.socket || window.socket.readyState !== WebSocket.OPEN) {
          initializeWebSocket((data) => {
            // Re-use the message handler from above
            switch (data.type) {
              case 'stream':
                get().appendToStream(data.data.message);
                break;
              case 'progress':
                get().setActiveAgent(data.source, true);
                break;
              case 'response':
                get().setActiveAgent(data.source, false);
                if (get().currentStream) {
                  get().finalizeStream();
                }
                break;
              case 'error':
                get().setActiveAgent(data.source, false);
                get().setError(data.data.message);
                break;
            }
          });
          
          // Wait for connection
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (window.socket?.readyState === WebSocket.OPEN) {
          const messageData = {
            message: content,
            source_agent: "frontend",
            target_agent: "orchestration-agent",
            timestamp: new Date().toISOString()
          };

          // Add user message to chat
          get().addMessage({
            content,
            role: 'user',
            timestamp: Date.now()
          });

          window.socket.send(JSON.stringify(messageData));
        } else {
          throw new Error("WebSocket is not connected");
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to send message",
          isTyping: false 
        });
      }
    }
  };
});
