'use client'

import * as React from 'react'
import { Command } from 'cmdk'

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && e.ctrlKey) {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
      <Command className="w-full max-w-md rounded-md bg-white p-2 shadow">
        <Command.Input placeholder="Go to..." className="w-full border-b px-2 py-1" />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
        </Command.List>
      </Command>
    </div>
  )
}
