'use client'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

export function Topbar({ className }: { className?: string }) {
  return (
    <header className={cn('flex h-12 items-center justify-between border-b border-border bg-white px-4 text-sm', className)}>
      <div className="flex items-center gap-4">
        <button className="font-semibold">Demo Co</button>
        <button className="text-xs" title="Alt+F2">Period</button>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 rounded border px-2 py-1">
          <Search className="h-4 w-4" />
          <span className="sr-only">Go To (Ctrl+G)</span>
        </button>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs">OWNER</span>
      </div>
    </header>
  )
}
