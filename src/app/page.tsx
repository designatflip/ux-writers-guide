import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CyclingWord from '@/components/CyclingWord'
import HomeSearch from '@/components/HomeSearch'

export const dynamic = 'force-dynamic'

function ComingSoon() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 py-6 text-center">
      <p className="text-sm font-medium text-stone-400">Coming soon</p>
      <p className="text-xs text-stone-300">This section isn&apos;t published yet.</p>
    </div>
  )
}

export default async function Home() {
  const supabase = await createClient()

  const [{ data: terms }, { data: guidelines }, { data: pillars }, { data: mechRules }, { data: siteSettings }] =
    await Promise.all([
      supabase.from('glossary_terms').select('id, term, term_bahasa, category').order('term'),
      supabase.from('guidelines').select('id, title, slug').order('order_index'),
      supabase.from('tone_pillars').select('id, title').order('order_index'),
      supabase.from('mechanics_rules').select('id, rule, category').order('order_index'),
      supabase.from('site_settings').select('value').eq('key', 'section_visibility').single(),
    ])

  const termList = terms ?? []
  const guidelineList = guidelines ?? []
  const pillarList = pillars ?? []
  const ruleList = mechRules ?? []

  const rawVis = (siteSettings as { value?: Record<string, boolean> } | null)?.value ?? {}
  const vis = {
    glossary:   rawVis.glossary   !== false,
    guidelines: rawVis.guidelines !== false,
    mechanics:  rawVis.mechanics  !== false,
    tone:       rawVis.tone       !== false,
  }

  const visibleTerms = termList.slice(0, 6)
  const visibleGuidelines = guidelineList.slice(0, 4)
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
            <span className="text-sm font-bold text-slate-900">Flip Communication Hub</span>
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
        <h1 className="mb-5 text-7xl font-black leading-none tracking-tight" style={{ color: '#111827' }}>
          Write like{' '}
          <CyclingWord />
        </h1>
        <p className="mb-8 text-lg leading-relaxed" style={{ color: '#78716c', maxWidth: '38rem' }}>
          Everything you need to communicate clearly, on-brand, and consistently,
          so we always sound like Flip!
        </p>
        <HomeSearch terms={termList} guidelines={guidelineList} rules={ruleList} />
      </section>

      {/* Section cards */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-5 gap-4">

          {/* Glossary — amber, col-span-3 */}
          <div className="col-span-3 flex flex-col overflow-hidden rounded-2xl shadow-sm">
            <div
              className="relative overflow-hidden p-6 pb-10"
              style={{
                backgroundColor: '#FFB207',
                backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0, transparent 14px, rgba(255,255,255,0.07) 14px, rgba(255,255,255,0.07) 15px)',
              }}
            >
              <div
                className="pointer-events-none absolute right-6 top-5 h-20 w-32 opacity-25"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
                  backgroundSize: '14px 14px',
                }}
              />
              <div className="flex items-start justify-between">
                <h2 className="text-4xl font-black leading-tight text-white">
                  Word list<br />
                  <span className="font-light">& glossary</span>
                </h2>
                <Link href="/glossary" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/70">Approved terms, preferred spellings, and definitions for every word we use.</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                {termList.length} {termList.length === 1 ? 'term' : 'terms'}
              </p>
            </div>
            <div className="flex-1 bg-white p-5">
              {!vis.glossary ? <ComingSoon /> : termList.length === 0 ? (
                <p className="text-sm text-stone-400">No terms yet — add the first one in the dashboard.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {visibleTerms.map((t) => (
                    <Link key={t.id} href="/glossary" className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-sm text-stone-700 transition-colors hover:border-stone-300">
                      {t.term_bahasa || t.term}
                    </Link>
                  ))}
                  {termList.length > 6 && (
                    <Link href="/glossary" className="rounded-full border border-dashed border-stone-300 px-3.5 py-1.5 text-sm text-stone-400 transition-colors hover:border-stone-400">
                      +{termList.length - 6} more
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Guidelines — red, col-span-2 */}
          <div className="col-span-2 flex flex-col overflow-hidden rounded-2xl shadow-sm">
            <div
              className="relative overflow-hidden p-6 pb-10"
              style={{
                backgroundColor: '#EE255C',
                backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0, transparent 14px, rgba(255,255,255,0.07) 14px, rgba(255,255,255,0.07) 15px)',
              }}
            >
              <svg className="pointer-events-none absolute bottom-3 right-4 opacity-40" width="120" height="30" viewBox="0 0 120 30">
                <path d="M0 15 Q15 0 30 15 Q45 30 60 15 Q75 0 90 15 Q105 30 120 15" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div className="flex items-start justify-between">
                <h2 className="text-4xl font-black leading-tight text-white">
                  Writing<br />
                  <span className="font-light">guidelines</span>
                </h2>
                <Link href="/guidelines" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/70">The rules that keep our writing consistent, clear, and on-brand.</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                {guidelineList.length} {guidelineList.length === 1 ? 'guideline' : 'guidelines'}
              </p>
            </div>
            <div className="flex-1 bg-white p-5">
              {!vis.guidelines ? <ComingSoon /> : guidelineList.length === 0 ? (
                <p className="text-sm text-stone-400">No guidelines yet — add the first one in the dashboard.</p>
              ) : (
                <ol className="flex flex-col gap-3">
                  {visibleGuidelines.map((g, i) => (
                    <li key={g.id}>
                      <Link href={`/guidelines/${g.slug}`} className="flex items-baseline gap-3 text-sm hover:opacity-70">
                        <span className="shrink-0 text-xs font-bold tabular-nums" style={{ color: '#EE255C' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium text-stone-800">{g.title}</span>
                      </Link>
                    </li>
                  ))}
                  {guidelineList.length > 4 && (
                    <li>
                      <Link href="/guidelines" className="text-xs font-medium" style={{ color: '#EE255C' }}>
                        +{guidelineList.length - 4} more
                      </Link>
                    </li>
                  )}
                </ol>
              )}
            </div>
          </div>

          {/* Mechanics — blue, col-span-2 */}
          <div className="col-span-2 flex flex-col overflow-hidden rounded-2xl shadow-sm">
            <div
              className="relative overflow-hidden p-6 pb-10"
              style={{
                backgroundColor: '#5786CC',
                backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0, transparent 14px, rgba(255,255,255,0.07) 14px, rgba(255,255,255,0.07) 15px)',
              }}
            >
              <svg className="pointer-events-none absolute bottom-3 right-4 opacity-40" width="120" height="30" viewBox="0 0 120 30">
                <path d="M0 15 Q15 0 30 15 Q45 30 60 15 Q75 0 90 15 Q105 30 120 15" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div className="flex items-start justify-between">
                <h2 className="text-4xl font-black leading-tight text-white">
                  Punctuation<br />
                  <span className="font-light">& mechanics</span>
                </h2>
                <Link href="/mechanics" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/70">The technical rules that keep our writing polished across every channel.</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                {ruleList.length} {ruleList.length === 1 ? 'rule' : 'rules'}
              </p>
            </div>
            <div className="flex-1 bg-white p-5">
              {!vis.mechanics ? <ComingSoon /> : ruleList.length === 0 ? (
                <p className="text-sm text-stone-400">No rules yet — add the first one in the dashboard.</p>
              ) : (
                <ol className="flex flex-col gap-3">
                  {visibleRules.map((r, i) => (
                    <li key={r.id} className="flex items-baseline gap-3 text-sm">
                      <span className="shrink-0 text-xs font-bold tabular-nums" style={{ color: '#5786CC' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-medium text-stone-800">{r.rule}</span>
                    </li>
                  ))}
                  {ruleList.length > 3 && (
                    <li>
                      <Link href="/mechanics" className="text-xs font-medium" style={{ color: '#5786CC' }}>
                        +{ruleList.length - 3} more
                      </Link>
                    </li>
                  )}
                </ol>
              )}
            </div>
          </div>

          {/* Tone — lime green, col-span-3 */}
          <div className="col-span-3 flex flex-col overflow-hidden rounded-2xl shadow-sm">
            <div
              className="relative overflow-hidden p-6 pb-10"
              style={{
                backgroundColor: '#46BFAE',
                backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0, transparent 14px, rgba(255,255,255,0.07) 14px, rgba(255,255,255,0.07) 15px)',
              }}
            >
              <svg className="pointer-events-none absolute bottom-2 right-4 opacity-40" width="140" height="44" viewBox="0 0 140 44">
                <polygon points="13,2 24,22 13,42 2,22" fill="none" stroke="white" strokeWidth="1.8"/>
                <polygon points="47,2 58,22 47,42 36,22" fill="none" stroke="white" strokeWidth="1.8"/>
                <polygon points="81,2 92,22 81,42 70,22" fill="none" stroke="white" strokeWidth="1.8"/>
                <polygon points="115,2 126,22 115,42 104,22" fill="none" stroke="white" strokeWidth="1.8"/>
              </svg>
              <div className="flex items-start justify-between">
                <h2 className="text-4xl font-black leading-tight text-white">
                  Tone of voice<br />
                  <span className="font-light">pillars</span>
                </h2>
                <Link href="/tone" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </Link>
              </div>
              <p className="mt-3 text-sm text-white/70">Our personality on the page — how we sound in everything we write.</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                {pillarList.length} {pillarList.length === 1 ? 'pillar' : 'pillars'}
              </p>
            </div>
            <div className="flex-1 bg-white p-5">
              {!vis.tone ? <ComingSoon /> : pillarList.length === 0 ? (
                <p className="text-sm text-stone-400">No pillars yet — add the first one in the dashboard.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pillarList.map((p, i) => {
                    const pillColors = ['#FFB207', '#EE255C', '#5786CC', '#46BFAE', '#B01D88']
                    return (
                      <span key={p.id} className="rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ backgroundColor: pillColors[i % pillColors.length] }}>
                        {p.title}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
