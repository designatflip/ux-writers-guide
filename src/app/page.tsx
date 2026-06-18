import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const [{ data: terms }, { data: guidelines }, { data: pillars }, { data: mechRules }] =
    await Promise.all([
      supabase.from('glossary_terms').select('id, term, term_bahasa, category').order('term'),
      supabase.from('guidelines').select('id, title, slug').order('order_index'),
      supabase.from('tone_pillars').select('id, title').order('order_index'),
      supabase.from('mechanics_rules').select('id, rule, example').order('order_index'),
    ])

  const termList = terms ?? []
  const guidelineList = guidelines ?? []
  const pillarList = pillars ?? []
  const ruleList = mechRules ?? []

  const visibleTerms = termList.slice(0, 6)
  const visibleGuidelines = guidelineList.slice(0, 4)
  const visiblePillars = pillarList.slice(0, 6)
  const visibleRules = ruleList.slice(0, 3)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2eb' }}>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#111827' }}>
              ✦
            </span>
            <span className="text-sm font-bold text-slate-900">UX Writers Guide</span>
          </Link>
          <Link href="/glossary" className="flex flex-1 items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-400 transition-colors hover:border-stone-300 max-w-lg">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search terms, rules, guidelines...
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <Link href="/glossary" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Glossary</Link>
            <Link href="/guidelines" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Guidelines</Link>
            <Link href="/tone" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Tone</Link>
            <Link href="/mechanics" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Mechanics</Link>
            <Link href="/entries" className="text-sm font-semibold text-stone-900 hover:text-stone-600 transition-colors">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase text-white" style={{ backgroundColor: '#111827', letterSpacing: '0.14em' }}>
            ✦ UX Writers Guide
          </span>
        </div>
        <h1 className="mb-5 text-7xl font-black leading-none tracking-tight" style={{ color: '#111827' }}>
          Write like{' '}
          <span style={{ textDecoration: 'underline', textDecorationColor: '#f59e0b', textDecorationThickness: '6px', textUnderlineOffset: '8px' }}>
            one team.
          </span>
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: '#78716c', maxWidth: '38rem' }}>
          Everything you need to communicate clearly, on-brand, and consistently —
          from a single word to a full product campaign.
        </p>
      </section>

      {/* Section cards */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-2 gap-4">

          {/* Glossary — warm yellow */}
          <div className="flex flex-col rounded-2xl p-6" style={{ backgroundColor: '#fdf8e7' }}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: '#fef3c7' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                {termList.length} {termList.length === 1 ? 'term' : 'terms'}
              </span>
            </div>
            <h2 className="mb-1 text-lg font-bold" style={{ color: '#111827' }}>Word list &amp; glossary</h2>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: '#78716c' }}>
              Approved terms, preferred spellings, and definitions for every word we use.
            </p>
            {termList.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed py-10" style={{ borderColor: '#f5d782' }}>
                <p className="text-sm" style={{ color: '#b45309' }}>No terms yet — add the first one in the dashboard.</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap gap-2">
                {visibleTerms.map((t) => (
                  <Link key={t.id} href="/glossary" className="inline-flex items-center gap-1.5 rounded-lg border border-amber-100 bg-white px-3 py-1.5 text-xs transition-colors hover:border-amber-200">
                    <span className="font-semibold text-slate-800">{t.term}</span>
                    {t.term_bahasa && <span style={{ color: '#a3a3a3' }}>{t.term_bahasa}</span>}
                    {t.category && <span className="rounded px-1 py-0.5 text-[10px]" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>{t.category}</span>}
                  </Link>
                ))}
                {termList.length > 6 && (
                  <Link href="/glossary" className="inline-flex items-center rounded-lg border border-amber-100 bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:border-amber-200" style={{ color: '#b45309' }}>
                    +{termList.length - 6} more
                  </Link>
                )}
              </div>
            )}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/glossary" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#d97706' }}>Open section</Link>
              <Link href="/glossary" className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>→</Link>
            </div>
          </div>

          {/* Guidelines — light pink */}
          <div className="flex flex-col rounded-2xl p-6" style={{ backgroundColor: '#fde8e2' }}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: '#fecaca' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#fecaca', color: '#ef4444' }}>
                {guidelineList.length} {guidelineList.length === 1 ? 'guideline' : 'guidelines'}
              </span>
            </div>
            <h2 className="mb-1 text-lg font-bold" style={{ color: '#111827' }}>Writing guidelines</h2>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: '#78716c' }}>
              The rules that keep our writing consistent, clear, and on-brand across every touchpoint.
            </p>
            {guidelineList.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed py-10" style={{ borderColor: '#fca5a5' }}>
                <p className="text-sm" style={{ color: '#dc2626' }}>No guidelines yet — add the first one in the dashboard.</p>
              </div>
            ) : (
              <ol className="flex flex-1 flex-col gap-2">
                {visibleGuidelines.map((g, i) => (
                  <li key={g.id}>
                    <Link href={`/guidelines/${g.slug}`} className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm transition-colors hover:border-red-200">
                      <span className="shrink-0 text-xs font-bold tabular-nums" style={{ color: '#ef4444' }}>{i + 1}</span>
                      <span className="font-medium text-slate-800">{g.title}</span>
                    </Link>
                  </li>
                ))}
                {guidelineList.length > 4 && (
                  <li>
                    <Link href="/guidelines" className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:border-red-200" style={{ color: '#dc2626' }}>
                      +{guidelineList.length - 4} more
                    </Link>
                  </li>
                )}
              </ol>
            )}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/guidelines" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#ef4444' }}>Open section</Link>
              <Link href="/guidelines" className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ backgroundColor: '#fecaca', color: '#ef4444' }}>→</Link>
            </div>
          </div>

          {/* Tone of Voice — mint teal */}
          <div className="flex flex-col rounded-2xl p-6" style={{ backgroundColor: '#e6faf6' }}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: '#ccfbf1' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                {pillarList.length} {pillarList.length === 1 ? 'pillar' : 'pillars'}
              </span>
            </div>
            <h2 className="mb-1 text-lg font-bold" style={{ color: '#111827' }}>Tone of voice</h2>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: '#78716c' }}>
              Our personality on the page — how we sound in everything we write.
            </p>
            {pillarList.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed py-10" style={{ borderColor: '#99f6e4' }}>
                <p className="text-sm" style={{ color: '#0f766e' }}>No pillars yet — add the first one in the dashboard.</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap gap-2">
                {visiblePillars.map((p) => (
                  <span key={p.id} className="inline-flex items-center rounded-xl border border-teal-100 bg-white px-3 py-2 text-sm font-medium text-slate-800">
                    {p.title}
                  </span>
                ))}
                {pillarList.length > 6 && (
                  <Link href="/tone" className="inline-flex items-center rounded-xl border border-teal-100 bg-white px-3 py-2 text-sm font-medium transition-colors hover:border-teal-200" style={{ color: '#0f766e' }}>
                    +{pillarList.length - 6} more
                  </Link>
                )}
              </div>
            )}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/tone" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#0d9488' }}>Open section</Link>
              <Link href="/tone" className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>→</Link>
            </div>
          </div>

          {/* Mechanics — lavender */}
          <div className="flex flex-col rounded-2xl p-6" style={{ backgroundColor: '#eef0fb' }}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: '#e0e7ff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}>
                {ruleList.length} {ruleList.length === 1 ? 'rule' : 'rules'}
              </span>
            </div>
            <h2 className="mb-1 text-lg font-bold" style={{ color: '#111827' }}>Mechanics</h2>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: '#78716c' }}>
              The technical rules that keep our writing polished across every channel.
            </p>
            {ruleList.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed py-10" style={{ borderColor: '#c7d2fe' }}>
                <p className="text-sm" style={{ color: '#4338ca' }}>No rules yet — add the first one in the dashboard.</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-2">
                {visibleRules.map((r) => (
                  <div key={r.id} className="rounded-xl border border-indigo-100 bg-white px-4 py-3">
                    <p className="mb-1 text-[11px] font-medium" style={{ color: '#818cf8' }}>{r.rule}</p>
                    {r.example && (
                      <p className="font-mono text-xs text-slate-600">
                        <span className="mr-1" style={{ color: '#6366f1' }}>✓</span>
                        {r.example}
                      </p>
                    )}
                  </div>
                ))}
                {ruleList.length > 3 && (
                  <Link href="/mechanics" className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-xs font-medium transition-colors hover:border-indigo-200" style={{ color: '#4338ca' }}>
                    +{ruleList.length - 3} more rules
                  </Link>
                )}
              </div>
            )}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/mechanics" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#6366f1' }}>Open section</Link>
              <Link href="/mechanics" className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}>→</Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
