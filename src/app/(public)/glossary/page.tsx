import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import GlossaryCard from '@/components/glossary/GlossaryCard'
import GlossarySearch from '@/components/glossary/GlossarySearch'
import Badge from '@/components/ui/Badge'
import type { GlossaryTerm } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; view?: string }>
}

export default async function GlossaryPage({ searchParams }: Props) {
  const { q, category, sort, view } = await searchParams
  const supabase = await createClient()
  const ascending = sort !== 'desc'
  const isListView = view === 'list'

  let query = supabase
    .from('glossary_terms')
    .select('*')
    .eq('status', 'published')
    .order('term_bahasa', { ascending, nullsFirst: false })
    .order('term', { ascending })

  if (q) query = query.or(`term_bahasa.ilike.%${q}%,term.ilike.%${q}%`)
  if (category) query = query.eq('category', category)

  const { data: terms } = await query

  const { data: cats } = await supabase
    .from('glossary_terms')
    .select('category')
    .eq('status', 'published')
    .not('category', 'is', null)

  const categories = [...new Set((cats ?? []).map((c) => c.category).filter(Boolean))] as string[]
  const entries: GlossaryTerm[] = terms ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Glossary</h1>
        <p className="text-slate-500">Shared vocabulary for the writing team.</p>
      </div>

      <div className="mb-6">
        <Suspense>
          <GlossarySearch categories={categories} />
        </Suspense>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-slate-500">No terms found.</p>
        </div>
      ) : isListView ? (
        <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
          {entries.map((term) => (
            <div key={term.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              {/* Term */}
              <div className="w-44 shrink-0">
                <p className="text-sm font-semibold text-slate-900">
                  {term.term_bahasa || term.term}
                </p>
                {term.term_bahasa && (
                  <p className="text-xs text-slate-400">{term.term}</p>
                )}
              </div>

              {/* Category */}
              <div className="w-28 shrink-0 pt-0.5">
                {term.category && <Badge color="indigo">{term.category}</Badge>}
              </div>

              {/* Definition + avoid */}
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-slate-600">{term.definition}</p>
                {term.avoid && term.avoid.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-medium text-red-500">Avoid</span>
                    {term.avoid.map((a) => (
                      <Badge key={a} color="red">{a}</Badge>
                    ))}
                  </div>
                )}
                {term.tags && term.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {term.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map((term) => (
            <GlossaryCard key={term.id} term={term} />
          ))}
        </div>
      )}
    </div>
  )
}
