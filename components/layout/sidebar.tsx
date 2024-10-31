'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/lib/stores/layout'
import { cn } from '@/lib/utils'
import { DocumentTree } from '@/components/documents/document-tree'

export function Sidebar() {
  const isOpen = useStore((state) => state.isSidebarOpen)

  return (
    <aside
      className={cn(
        'border-r bg-background transition-all duration-300',
        isOpen ? 'w-64' : 'w-0'
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-4">
          <DocumentTree />
        </div>
      </ScrollArea>
    </aside>
  )
}