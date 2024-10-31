'use client'

import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from 'reactflow'
import { AgentNode } from './nodes/agent-node'
import { useStore } from '@/lib/stores/agents'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import 'reactflow/dist/style.css'

const nodeTypes = {
  agent: AgentNode,
}

export function Dashboard() {
  const { 
    nodes, 
    edges, 
    isProcessing,
    setNodes, 
    setEdges,
    startProcessing,
    stopProcessing,
    resetNodes
  } = useStore()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )

  const handleStart = () => {
    startProcessing()
    toast.success('Agent processing started')
  }

  const handlePause = () => {
    stopProcessing()
    toast.info('Agent processing paused')
  }

  const handleReset = () => {
    resetNodes()
    toast.info('Agents reset to initial state')
  }

  return (
    <div className="h-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-muted/5"
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleStart}
            disabled={isProcessing}
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePause}
            disabled={!isProcessing}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}