import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import Badge from '@/components/ui/Badge'
import type { Tool } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('tools').select('name').eq('slug', slug).single()
  return { title: data?.name ? `${data.name} — Flip Communication Hub` : 'Tool' }
}

function CtaButton({ tool }: { tool: Tool }) {
  if (tool.link_type === 'instructions') {
    return tool.instructions ? (
      <p className="text-sm italic text-neutral-500">{tool.instructions}</p>
    ) : null
  }
  if (!tool.url) return null
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg bg-flip-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-flip-orange-700"
    >
      {tool.link_type === 'download' ? 'Download' : 'Open'}
      {tool.link_type === 'url' && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      )}
    </a>
  )
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const [vis, supabase] = await Promise.all([getSectionVisibility(), createClient()])

  if (!vis.tools) {
    return (
      <div className="max-w-2xl">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          ← Back to Tools
        </Link>
        <div className="mt-16 rounded-xl border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-base font-semibold text-neutral-200">Coming soon</p>
          <p className="mt-1 text-sm text-neutral-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) notFound()
  const tool = data as Tool

  return (
    <div className="max-w-2xl">
      <Link href="/tools" className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to Tools
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-bold text-neutral-900">{tool.name}</h1>
        <Badge color="indigo">{tool.type}</Badge>
      </div>
      <p className="mb-6 text-neutral-600">{tool.description}</p>

      <div className="mb-8">
        <CtaButton tool={tool} />
      </div>

      {tool.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tool.image_url}
          alt={`Preview of ${tool.name}`}
          className="mb-8 h-auto w-full rounded-xl border border-neutral-200 object-contain"
        />
      )}

      {tool.content ? (
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              img: ({ src, alt }) =>
                src ? <img src={src} alt={alt ?? ''} className="max-w-full rounded" /> : null,
            }}
          >
            {tool.content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-neutral-400">No details yet.</p>
      )}
    </div>
  )
}
