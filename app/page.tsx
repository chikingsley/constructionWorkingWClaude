import { MainLayout } from '@/components/layout/main-layout'
import { Dashboard } from '@/components/dashboard/dashboard'
import { Chat } from '@/components/chat/chat'
import { DocumentPreview } from '@/components/documents/document-preview'

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-1 overflow-hidden">
        <DocumentPreview />
        <Dashboard />
        <Chat />
      </div>
    </MainLayout>
  )
}