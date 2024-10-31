import { create } from 'zustand'
import { type Document } from '@/lib/types/document'

interface DocumentStore {
  documents: Document[]
  selectedId: string | null
  expandedIds: Set<string>
  setDocuments: (documents: Document[]) => void
  selectDocument: (id: string | null) => void
  toggleExpanded: (id: string) => void
}

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Project Alpha',
    type: 'folder',
    children: [
      {
        id: '1-1',
        name: 'Architectural Plans',
        type: 'folder',
        children: [
          {
            id: '1-1-1',
            name: 'Floor Plans.pdf',
            type: 'file',
            status: 'approved',
            lastModified: Date.now(),
          },
          {
            id: '1-1-2',
            name: 'Elevations.pdf',
            type: 'file',
            status: 'review',
            lastModified: Date.now(),
          },
        ],
      },
      {
        id: '1-2',
        name: 'Specifications',
        type: 'folder',
        children: [
          {
            id: '1-2-1',
            name: 'Material Specs.docx',
            type: 'file',
            status: 'draft',
            lastModified: Date.now(),
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Project Beta',
    type: 'folder',
    children: [
      {
        id: '2-1',
        name: 'Construction Schedule.xlsx',
        type: 'file',
        status: 'approved',
        lastModified: Date.now(),
      },
    ],
  },
]

export const useStore = create<DocumentStore>((set) => ({
  documents: initialDocuments,
  selectedId: null,
  expandedIds: new Set(['1']),
  setDocuments: (documents) => set({ documents }),
  selectDocument: (id) => set({ selectedId: id }),
  toggleExpanded: (id) =>
    set((state) => {
      const newExpandedIds = new Set(state.expandedIds)
      if (newExpandedIds.has(id)) {
        newExpandedIds.delete(id)
      } else {
        newExpandedIds.add(id)
      }
      return { expandedIds: newExpandedIds }
    }),
}))