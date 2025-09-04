import { cn } from '@/lib/utils'

export function RightPanel({ className }: { className?: string }) {
  return (
    <aside className={cn('space-y-6 border-l border-border p-4 text-sm', className)}>
      <section>
        <h2 className="mb-2 font-semibold">Change View</h2>
      </section>
      <section>
        <h2 className="mb-2 font-semibold">Filters</h2>
      </section>
      <section>
        <h2 className="mb-2 font-semibold">Exceptions</h2>
      </section>
      <section>
        <h2 className="mb-2 font-semibold">Export</h2>
      </section>
    </aside>
  )
}
