'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { useStore } from '@/lib/stores/layout'

export function Header() {
  const toggleSidebar = useStore((state) => state.toggleSidebar)

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}