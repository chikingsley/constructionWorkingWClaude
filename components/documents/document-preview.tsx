'use client'

import { FileText, Calendar, CheckCircle2, XCircle, PanelLeftClose } from 'lucide-react'
import { format } from 'date-fns'
import { useStore as useDocumentStore } from '@/lib/stores/documents'
import { useStore as useLayoutStore } from '@/lib/stores/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DocumentEditor } from '@/components/editor/document-editor'
import { useState } from 'react'

function findDocument(documents: any[], id: string): any {
  for (const doc of documents) {
    if (doc.id === id) return doc
    if (doc.children) {
      const found = findDocument(doc.children, id)
      if (found) return found
    }
  }
  return null
}

function PreviewSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-[400px]" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NoSelection() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>No Document Selected</CardTitle>
          <CardDescription>
            Select a document from the sidebar to view its details
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-muted text-muted-foreground',
    icon: FileText,
  },
  review: {
    label: 'In Review',
    color: 'bg-yellow-500 text-white',
    icon: Calendar,
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-500 text-white',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-500 text-white',
    icon: XCircle,
  },
}

export function DocumentPreview() {
  const { documents, selectedId } = useDocumentStore()
  const { isPreviewOpen, togglePreview } = useLayoutStore()
  
  return (
    <div className={cn(
      'border-r bg-background transition-all duration-300',
      isPreviewOpen ? 'w-[600px]' : 'w-0'
    )}>
      <div className="relative h-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-10 top-4 z-10"
          onClick={togglePreview}
        >
          <PanelLeftClose className={cn(
            "h-5 w-5 transition-transform",
            !isPreviewOpen && "rotate-180"
          )} />
          <span className="sr-only">Toggle preview</span>
        </Button>

        <div className="h-full overflow-hidden">
          {!selectedId ? (
            <NoSelection />
          ) : (
            <PreviewContent document={findDocument(documents, selectedId)} />
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewContent({ document }: { document: any }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [content, setContent] = useState(document?.content || '<p>Start editing this document...</p>')

  if (!document) return <PreviewSkeleton />

  const status = document.status ? statusConfig[document.status] : null
  const StatusIcon = status?.icon

  return (
    <>
      <div className="flex h-full items-start justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{document.name}</CardTitle>
              {status && (
                <Badge variant="secondary" className={status.color}>
                  {status.label}
                </Badge>
              )}
            </div>
            <CardDescription>
              Last modified:{' '}
              {document.lastModified
                ? format(document.lastModified, 'PPP')
                : 'Not available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {document.type === 'file' ? (
              <div className="aspect-[16/10] rounded-lg border bg-muted/50">
                <div className="flex h-full items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/10 p-4">
                <p className="text-sm text-muted-foreground">
                  This is a folder containing {document.children?.length || 0} items
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {StatusIcon && <StatusIcon className="h-4 w-4" />}
              <span>ID: {document.id}</span>
            </div>
            <div className="flex gap-2">
              {document.type === 'file' && (
                <>
                  <Button variant="secondary" size="sm">
                    Download
                  </Button>
                  <Button size="sm" onClick={() => setIsEditorOpen(true)}>
                    Open
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{document.name}</DialogTitle>
          </DialogHeader>
          <DocumentEditor
            content={content}
            onChange={setContent}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}