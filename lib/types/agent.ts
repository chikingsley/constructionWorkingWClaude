export interface AgentNode {
  id: string
  type: 'agent'
  data: {
    name: string
    description: string
    type: 'document' | 'technical' | 'compliance' | 'cost' | 'orchestration' | 'resource'
    status: 'idle' | 'processing' | 'complete' | 'error'
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
  data: {
    type: 'data' | 'control'
    status: 'active' | 'inactive'
  }
}
