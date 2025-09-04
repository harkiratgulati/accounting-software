'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  { title: 'Masters', href: '/masters' },
  { title: 'Vouchers', href: '/vouchers' },
  { title: 'Orders', href: '/orders' },
  { title: 'Inventory', href: '/inventory' },
  { title: 'Banking', href: '/banking' },
  { title: 'Reports', href: '/reports' },
  { title: 'Admin', href: '/admin' }
]

export function SidebarTree({ className }: { className?: string }) {
  const [open, setOpen] = useState<Record<string, boolean>>({})
  return (
    <aside className={cn('border-r border-border p-2 text-sm', className)}>
      {sections.map(sec => (
        <div key={sec.title}>
          <button
            className="flex w-full items-center justify-between py-1 font-semibold"
            onClick={() => setOpen(o => ({ ...o, [sec.title]: !o[sec.title] }))}
          >
            {sec.title}
            <ChevronRight className={cn('h-4 w-4 transition-transform', open[sec.title] && 'rotate-90')} />
          </button>
          {open[sec.title] && (
            <ul className="ml-4">
              <li>
                <Link href={sec.href} className="block rounded px-2 py-1 hover:bg-slate-100 focus:bg-slate-100">
                  {sec.title}
                </Link>
              </li>
            </ul>
          )}
        </div>
      ))}
    </aside>
  )
}
