import type { ReactNode } from 'react'
import { SidebarTree } from '@/components/SidebarTree'
import { Topbar } from '@/components/Topbar'
import { TabStrip } from '@/components/TabStrip'
import { RightPanel } from '@/components/RightPanel'
import { CommandPalette } from '@/components/CommandPalette'

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr_280px] grid-rows-[auto_auto_1fr]">
      <SidebarTree className="row-span-3" />
      <Topbar className="col-start-2" />
      <TabStrip className="col-start-2 row-start-2" />
      <RightPanel className="col-start-3 row-span-3 hidden xl:block" />
      <main className="col-start-2 row-start-3 overflow-auto p-4">{children}</main>
      <CommandPalette />
    </div>
  )
}
