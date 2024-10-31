export interface AgentNode {
  id: string
  type: 'document' | 'technical' | 'compliance' | 'cost'
  status: 'idle' | 'processing' | 'complete' | 'error'
  data: {
    name: string
    description: string
    currentTask?: string
    progress?: number
    error?: string
  }
  position: { x: number; y: number }
}

export interface AgentEdge {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
  data?: {
    type: 'data' | 'control'
    status?: 'active' | 'inactive'
  }
}