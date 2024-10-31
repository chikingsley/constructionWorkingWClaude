'use client'

import { Editor, FloatingMenu } from '@tiptap/react'
import {
  Plus,
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditorFloatingMenuProps {
  editor: Editor
}

export function EditorFloatingMenu({ editor }: EditorFloatingMenuProps) {
  if (!editor) return null

  return (
    <FloatingMenu
      className="flex w-fit divide-x divide-border rounded-lg border border-border bg-background shadow-md"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Text className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <CheckSquare className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="h-4 w-4" />
      </Button>
    </FloatingMenu>
  )
}