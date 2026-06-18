import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import GlossaryCard from '@/components/glossary/GlossaryCard'
import GlossarySearch from '@/components/glossary/GlossarySearch'
import type { GlossaryTerm } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function GlossaryPage({ searchParams }: Props) {
  const { q, category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('glossary_terms')
    .select('*')
    .eq('status', 'published')
    .order('term_bahasa', { ascending: true, nullsFirst: false })
    .order('term', { ascending: true })

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
