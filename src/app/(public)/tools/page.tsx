import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import Badge from '@/components/ui/Badge'
import type { Tool } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tools — Flip Communication Hub' }

function ToolCard({ tool }: { tool: Tool }) {
  const detailHref = tool.slug ? `/tools/${tool.slug}` : null

  const inner = (
    <>
      {tool.image_url && (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.image_url}
            alt={`Preview of ${tool.name}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h2 className={`text-base font-semibold text-neutral-900 ${detailHref ? 'group-hover:underline' : ''}`}>{tool.name}</h2>
          <Badge color="indigo">{tool.type}</Badge>
        </div>
        <p className="text-sm leading-relaxed text-neutral-600">{tool.description}</p>
        {tool.link_type === 'instructions' && tool.instructions && (
          <p className="mt-3 text-sm italic text-neutral-500">{tool.instructions}</p>
        )}
      </div>
    </>
  )

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-flip-orange-200 hover:shadow-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      {detailHref ? (
        <Link href={detailHref} className="group flex min-w-0 flex-1 gap-4">
          {inner}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 gap-4">{inner}</div>
      )}

      {tool.link_type !== 'instructions' && tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-300"
        >
          {tool.link_type === 'download' ? 'Download' : 'Open'}
          {tool.link_type === 'url' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          )}
        </a>
      )}
    </div>
  )
}

export default async function ToolsPage() {
  const [vis, supabase] = await Promise.all([
    getSectionVisibility(),
    createClient(),
  ])

  if (!vis.tools) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold text-neutral-900">Tools</h1>
          <p className="text-neutral-600">Everything the team has built to put our guidelines into practice.</p>
        </div>
        <div className="rounded-xl border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-base font-semibold text-neutral-200">Coming soon</p>
          <p className="mt-1 text-sm text-neutral-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

  const { data } = await supabase
    .from('tools')
    .select('*')
    .order('order_index', { ascending: true })

  const tools = data ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-neutral-900">Tools</h1>
        <p className="text-neutral-600">Everything the team has built to put our guidelines into practice.</p>
      </div>

      {tools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-neutral-600">No tools published yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool as Tool} />
          ))}
        </div>
      )}
    </div>
  )
}
