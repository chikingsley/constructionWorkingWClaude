'use client'

import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { FileText, HardHat, Scale, Calculator, Network, Database } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const agentIcons = {
  document: FileText,
  technical: HardHat,
  compliance: Scale,
  cost: Calculator,
  orchestration: Network,
  resource: Database
}

interface AgentNodeProps {
  data: {
    name: string
    description: string
    type: keyof typeof agentIcons
    status: 'idle' | 'processing' | 'complete' | 'error'
    currentTask?: string
    progress?: number
    error?: string
  }
}

function AgentNodeComponent({ data }: AgentNodeProps) {
  const Icon = agentIcons[data.type]
  const isProcessing = data.status === 'processing'
  const isError = data.status === 'error'
  const isComplete = data.status === 'complete'

  return (
    <div className={cn(
      'rounded-lg border bg-card p-4 shadow-sm',
      'w-[280px] select-none',
      isError && 'border-destructive',
      isComplete && 'border-green-500'
    )}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      
      <div className="flex items-start gap-3">
        <div className={cn(
          'rounded-full p-2',
          'bg-muted text-muted-foreground',
          isProcessing && 'animate-pulse bg-blue-100 text-blue-500 dark:bg-blue-900',
          isError && 'bg-red-100 text-red-500 dark:bg-red-900',
          isComplete && 'bg-green-100 text-green-500 dark:bg-green-900'
        )}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">
            {data.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {data.description}
          </p>
        </div>
      </div>

      {isProcessing && data.currentTask && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">{data.currentTask}</p>
          <Progress value={data.progress} className="h-1" />
        </div>
      )}

      {isError && data.error && (
        <p className="mt-2 text-xs text-destructive">{data.error}</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}

export const AgentNode = memo(AgentNodeComponent)
