'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import typescript from 'highlight.js/lib/languages/typescript'
import { cn } from '@/lib/utils'
import { EditorBubbleMenu } from './editor-bubble-menu'
import { EditorFloatingMenu } from './editor-floating-menu'
import { EditorToolbar } from './editor-toolbar'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'

const lowlight = createLowlight()
lowlight.register('js', js)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('typescript', typescript)

interface DocumentEditorProps {
  content: string
  onChange?: (content: string) => void
  editable?: boolean
  className?: string
}

const extensions = [
  StarterKit.configure({
    document: false,
    paragraph: false,
    text: false,
    history: {
      depth: 10,
      newGroupDelay: 300,
    },
  }),
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Highlight,
  Typography,
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'typescript',
  }),
]

export function DocumentEditor({
  content,
  onChange,
  editable = true,
  className,
}: DocumentEditorProps) {
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions,
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    onCreate: ({ editor }) => {
      // Initial content setup
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn('relative min-h-[500px] w-full', className)}>
      {editor && <EditorBubbleMenu editor={editor} />}
      {editor && <EditorFloatingMenu editor={editor} />}
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className="prose prose-neutral dark:prose-invert max-w-none" />
    </div>
  )
}