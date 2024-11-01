import { create } from 'zustand'
import { type Node, type Edge } from 'reactflow'
import { AgentNode, AgentEdge } from '../types/agent'

interface AgentsState {
  nodes: Node<AgentNode['data']>[]
  edges: Edge<AgentEdge['data']>[]
  isProcessing: boolean
  currentStep: number
  socket: WebSocket | null
  setNodes: (nodes: Node<AgentNode['data']>[] | ((prev: Node<AgentNode['data']>[]) => Node<AgentNode['data']>[])) => void
  setEdges: (edges: Edge<AgentEdge['data']>[] | ((prev: Edge<AgentEdge['data']>[]) => Edge<AgentEdge['data']>[])) => void
  startProcessing: () => void
  stopProcessing: () => void
  resetNodes: () => void
  connectWebSocket: () => void
  disconnectWebSocket: () => void
  sendMessage: (message: string, sourceAgent: string, targetAgent: string) => void
}

const initialNodes: Node<AgentNode['data']>[] = [
  {
    id: 'orchestration-agent',
    type: 'agent',
    position: { x: 250, y: 0 },
    data: {
      name: 'Project Orchestration Agent',
      description: 'Coordinates project workflow and agent communication',
      type: 'orchestration',
      status: 'idle',
    },
  },
  {
    id: 'document-agent',
    type: 'agent',
    position: { x: 250, y: 150 },
    data: {
      name: 'Document Creation Agent',
      description: 'Creates and manages construction documentation',
      type: 'document',
      status: 'idle',
    },
  },
  {
    id: 'technical-agent',
    type: 'agent',
    position: { x: 100, y: 300 },
    data: {
      name: 'Technical Validation Agent',
      description: 'Validates technical aspects and specifications',
      type: 'technical',
      status: 'idle',
    },
  },
  {
    id: 'compliance-agent',
    type: 'agent',
    position: { x: 400, y: 300 },
    data: {
      name: 'Compliance Agent',
      description: 'Ensures regulatory compliance',
      type: 'compliance',
      status: 'idle',
    },
  },
  {
    id: 'cost-agent',
    type: 'agent',
    position: { x: 250, y: 450 },
    data: {
      name: 'Cost Analysis Agent',
      description: 'Analyzes costs and validates budgets',
      type: 'cost',
      status: 'idle',
    },
  },
  {
    id: 'resource-agent',
    type: 'agent',
    position: { x: 250, y: 600 },
    data: {
      name: 'Resource Management Agent',
      description: 'Manages project resources and allocations',
      type: 'resource',
      status: 'idle',
    },
  },
]

const initialEdges: Edge<AgentEdge['data']>[] = [
  // Orchestration agent connections
  {
    id: 'orchestration-doc',
    source: 'orchestration-agent',
    target: 'document-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'orchestration-tech',
    source: 'orchestration-agent',
    target: 'technical-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'orchestration-compliance',
    source: 'orchestration-agent',
    target: 'compliance-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'orchestration-cost',
    source: 'orchestration-agent',
    target: 'cost-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'orchestration-resource',
    source: 'orchestration-agent',
    target: 'resource-agent',
    data: { type: 'control', status: 'inactive' },
  },
  // Document agent connections
  {
    id: 'doc-tech',
    source: 'document-agent',
    target: 'technical-agent',
    data: { type: 'data', status: 'inactive' },
  },
  {
    id: 'doc-compliance',
    source: 'document-agent',
    target: 'compliance-agent',
    data: { type: 'data', status: 'inactive' },
  },
  {
    id: 'doc-cost',
    source: 'document-agent',
    target: 'cost-agent',
    data: { type: 'data', status: 'inactive' },
  },
  // Technical agent connections
  {
    id: 'tech-compliance',
    source: 'technical-agent',
    target: 'compliance-agent',
    data: { type: 'data', status: 'inactive' },
  },
  {
    id: 'tech-resource',
    source: 'technical-agent',
    target: 'resource-agent',
    data: { type: 'data', status: 'inactive' },
  },
  // Compliance agent connections
  {
    id: 'compliance-resource',
    source: 'compliance-agent',
    target: 'resource-agent',
    data: { type: 'data', status: 'inactive' },
  },
  // Cost agent connections
  {
    id: 'cost-resource',
    source: 'cost-agent',
    target: 'resource-agent',
    data: { type: 'data', status: 'inactive' },
  },
]

export const useStore = create<AgentsState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isProcessing: false,
  currentStep: 0,
  socket: null,

  setNodes: (nodes) => set((state) => ({ 
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes 
  })),

  setEdges: (edges) => set((state) => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),

  connectWebSocket: () => {
    const socket = new WebSocket('ws://localhost:8000/ws/frontend')
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      // Update node status based on agent activity
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === data.target) {
            return {
              ...node,
              data: {
                ...node.data,
                status: 'processing',
                currentTask: data.data.message || data.data,
                progress: data.data.progress || 0,
              },
            }
          }
          return node
        }),
        edges: state.edges.map((edge) => {
          if (edge.source === data.source && edge.target === data.target) {
            const currentType = edge.data?.type || 'data'
            return {
              ...edge,
              animated: true,
              data: { type: currentType, status: 'active' },
            }
          }
          return edge
        }),
      }))

      // If the agent completed its task
      if (data.data.status === 'complete') {
        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (node.id === data.target) {
              return {
                ...node,
                data: {
                  ...node.data,
                  status: 'complete',
                  currentTask: undefined,
                  progress: undefined,
                },
              }
            }
            return node
          }),
        }))
      }
    }

    set({ socket })
  },

  disconnectWebSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.close()
      set({ socket: null })
    }
  },

  sendMessage: (message: string, sourceAgent: string, targetAgent: string) => {
    const { socket } = get()
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        message,
        source_agent: sourceAgent,
        target_agent: targetAgent
      }))
    }
  },

  startProcessing: () => {
    set({ isProcessing: true, currentStep: 0 })
    const { connectWebSocket, sendMessage } = get()
    connectWebSocket()
    // Start the process by sending initial message to orchestration agent
    sendMessage(
      "Start construction project planning",
      "frontend",
      "orchestration-agent"
    )
  },

  stopProcessing: () => {
    const { disconnectWebSocket } = get()
    disconnectWebSocket()
    set({ isProcessing: false, currentStep: 0 })
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'complete',
          currentTask: undefined,
          progress: undefined,
        },
      })),
      edges: state.edges.map((edge) => ({
        ...edge,
        animated: false,
        data: { 
          type: edge.data?.type || 'data', 
          status: 'inactive' 
        },
      })),
    }))
  },

  resetNodes: () => {
    const { disconnectWebSocket } = get()
    disconnectWebSocket()
    set({ currentStep: 0 })
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
          currentTask: undefined,
          progress: undefined,
          error: undefined,
        },
      })),
      edges: state.edges.map((edge) => ({
        ...edge,
        animated: false,
        data: { 
          type: edge.data?.type || 'data', 
          status: 'inactive' 
        },
      })),
    }))
  },
}))
