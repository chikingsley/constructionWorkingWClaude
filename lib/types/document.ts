export interface Document {
  id: string
  name: string
  type: 'folder' | 'file'
  icon?: string
  children?: Document[]
  status?: 'draft' | 'review' | 'approved' | 'rejected'
  lastModified?: number
}

export interface DocumentState {
  documents: Document[]
  selectedId: string | null
  expandedIds: Set<string>
}