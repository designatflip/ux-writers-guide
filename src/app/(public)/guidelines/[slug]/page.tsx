import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('guidelines').select('title').eq('slug', slug).single()
  return { title: data?.title ? `${data.title} — UX Writers Guide` : 'Guideline' }
}

export default async function GuidelineDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: guideline } = await supabase
    .from('guidelines')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!guideline) notFound()

  return (
    <div className="max-w-2xl">
      <Link href="/guidelines" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        ← Back to Guidelines
      </Link>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">{guideline.title}</h1>
      <p className="mb-8 text-sm text-slate-400">Updated {formatDate(guideline.updated_at)}</p>
      {guideline.content ? (
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              img: ({ src, alt }) =>
                src ? <img src={src} alt={alt ?? ''} className="max-w-full rounded" /> : null,
            }}
          >
            {guideline.content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-slate-400">No content yet.</p>
      )}
    </div>
  )
}
