import { create } from 'zustand'
import { type Node, type Edge } from 'reactflow'
import { AgentNode, AgentEdge } from '@/lib/types/agent'

interface AgentsState {
  nodes: Node<AgentNode['data']>[]
  edges: Edge<AgentEdge['data']>[]
  isProcessing: boolean
  currentStep: number
  setNodes: (nodes: Node<AgentNode['data']>[] | ((prev: Node<AgentNode['data']>[]) => Node<AgentNode['data']>[])) => void
  setEdges: (edges: Edge<AgentEdge['data']>[] | ((prev: Edge<AgentEdge['data']>[]) => Edge<AgentEdge['data']>[])) => void
  startProcessing: () => void
  stopProcessing: () => void
  resetNodes: () => void
  processNextStep: () => void
}

const initialNodes: Node<AgentNode['data']>[] = [
  {
    id: 'document-agent',
    type: 'agent',
    position: { x: 250, y: 100 },
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
    position: { x: 100, y: 250 },
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
    position: { x: 400, y: 250 },
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
    position: { x: 250, y: 400 },
    data: {
      name: 'Cost Analysis Agent',
      description: 'Analyzes costs and validates budgets',
      type: 'cost',
      status: 'idle',
    },
  },
]

const initialEdges: Edge<AgentEdge['data']>[] = [
  {
    id: 'doc-tech',
    source: 'document-agent',
    target: 'technical-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'doc-compliance',
    source: 'document-agent',
    target: 'compliance-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'doc-cost',
    source: 'document-agent',
    target: 'cost-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'tech-compliance',
    source: 'technical-agent',
    target: 'compliance-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'tech-cost',
    source: 'technical-agent',
    target: 'cost-agent',
    data: { type: 'control', status: 'inactive' },
  },
  {
    id: 'compliance-cost',
    source: 'compliance-agent',
    target: 'cost-agent',
    data: { type: 'control', status: 'inactive' },
  },
]

const workflowSteps = [
  {
    agent: 'document-agent',
    task: 'Creating initial project documentation',
    duration: 3000,
  },
  {
    agent: 'technical-agent',
    task: 'Validating technical specifications',
    duration: 4000,
  },
  {
    agent: 'compliance-agent',
    task: 'Checking regulatory compliance',
    duration: 3000,
  },
  {
    agent: 'cost-agent',
    task: 'Analyzing costs and preparing budget',
    duration: 4000,
  },
]

export const useStore = create<AgentsState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isProcessing: false,
  currentStep: 0,
  setNodes: (nodes) => set((state) => ({ 
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes 
  })),
  setEdges: (edges) => set((state) => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),
  startProcessing: () => {
    set({ isProcessing: true, currentStep: 0 })
    get().processNextStep()
  },
  stopProcessing: () => {
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
        data: { ...edge.data, status: 'inactive' },
      })),
    }))
  },
  resetNodes: () => {
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
        data: { ...edge.data, status: 'inactive' },
      })),
    }))
  },
  processNextStep: () => {
    const { currentStep } = get()
    if (currentStep >= workflowSteps.length) {
      get().stopProcessing()
      return
    }

    const step = workflowSteps[currentStep]
    
    // Update current agent status
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: node.id === step.agent ? 'processing' : node.data.status,
          currentTask: node.id === step.agent ? step.task : node.data.currentTask,
          progress: node.id === step.agent ? 0 : node.data.progress,
        },
      })),
    }))

    // Simulate progress updates
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 10
      if (progress <= 100) {
        set((state) => ({
          nodes: state.nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              progress: node.id === step.agent ? progress : node.data.progress,
            },
          })),
        }))
      }
    }, step.duration / 10)

    // Move to next step after duration
    setTimeout(() => {
      clearInterval(progressInterval)
      set((state) => ({
        nodes: state.nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            status: node.id === step.agent ? 'complete' : node.data.status,
            currentTask: node.id === step.agent ? undefined : node.data.currentTask,
            progress: node.id === step.agent ? undefined : node.data.progress,
          },
        })),
        currentStep: state.currentStep + 1,
      }))
      get().processNextStep()
    }, step.duration)
  },
}))