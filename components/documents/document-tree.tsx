'use client'

import { ChevronRight, Folder, File } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Document } from '@/lib/types/document'
import { useStore } from '@/lib/stores/documents'
import { Badge } from '@/components/ui/badge'

interface DocumentItemProps {
  document: Document
  level: number
}

function DocumentItem({ document, level }: DocumentItemProps) {
  const { selectedId, expandedIds, selectDocument, toggleExpanded } = useStore()
  const isSelected = selectedId === document.id
  const isExpanded = expandedIds.has(document.id)
  const hasChildren = document.children && document.children.length > 0

  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    review: 'bg-yellow-500 text-white',
    approved: 'bg-green-500 text-white',
    rejected: 'bg-red-500 text-white',
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50',
          isSelected && 'bg-muted/50'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        role="button"
        onClick={() => {
          selectDocument(document.id)
          if (hasChildren) {
            toggleExpanded(document.id)
          }
        }}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
        )}
        {!hasChildren && <span className="w-4" />}
        {document.type === 'folder' ? (
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <File className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 truncate">{document.name}</span>
        {document.status && (
          <Badge variant="secondary" className={cn('ml-auto', statusColors[document.status])}>
            {document.status}
          </Badge>
        )}
      </div>
      {isExpanded && document.children && (
        <div>
          {document.children.map((child) => (
            <DocumentItem key={child.id} document={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DocumentTree() {
  const documents = useStore((state) => state.documents)

  return (
    <div className="space-y-1">
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} level={0} />
      ))}
    </div>
  )
}