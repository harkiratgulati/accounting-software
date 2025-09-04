'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useState } from 'react'

interface Tab { id: string; title: string }

export function TabStrip({ className }: { className?: string }) {
  const [tabs, setTabs] = useState<Tab[]>([{ id: 'gateway', title: 'Gateway' }])
  const close = (id: string) => setTabs(tabs.filter(t => t.id !== id))
  return (
    <div className={cn('flex h-8 items-center gap-2 overflow-x-auto border-b border-border bg-white px-2 text-sm', className)}>
      {tabs.map(t => (
        <div key={t.id} className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1">
          {t.title}
          <button onClick={() => close(t.id)}>
            <X className="h-3 w-3" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  )
}
