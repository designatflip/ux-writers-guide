'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface SearchTerm { id: string; term: string; term_bahasa: string | null }
interface SearchGuideline { id: string; title: string; slug: string }
interface SearchRule { id: string; rule: string; category: string | null }

interface HomeSearchProps {
  terms: SearchTerm[]
  guidelines: SearchGuideline[]
  rules: SearchRule[]
}

export default function HomeSearch({ terms, guidelines, rules }: HomeSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const q = query.toLowerCase().trim()

  const matchedTerms = !q ? [] : terms
    .filter(t => t.term.toLowerCase().includes(q) || t.term_bahasa?.toLowerCase().includes(q))
    .slice(0, 5)

  const matchedGuidelines = !q ? [] : guidelines
    .filter(g => g.title.toLowerCase().includes(q))
    .slice(0, 4)

  const matchedRules = !q ? [] : rules
    .filter(r => r.rule.toLowerCase().includes(q))
    .slice(0, 4)

  const hasResults = matchedTerms.length > 0 || matchedGuidelines.length > 0 || matchedRules.length > 0
  const showDropdown = open && q.length > 0

  function close() { setOpen(false) }

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-2xl">
      {/* Input */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400"
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search terms, rules, guidelines…"
          className="w-full rounded-2xl border border-stone-200 bg-white py-4 pl-14 pr-5 text-base text-stone-900 shadow-sm placeholder-stone-400 transition-shadow focus:border-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-900/5"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setOpen(false) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
          {!hasResults ? (
            <p className="px-5 py-4 text-sm text-stone-400">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <>
              {matchedTerms.length > 0 && (
                <div>
                  <p className="px-5 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Glossary</p>
                  {matchedTerms.map((t) => (
                    <Link
                      key={t.id}
                      href={`/glossary?q=${encodeURIComponent(t.term_bahasa || t.term)}`}
                      onClick={close}
                      className="flex items-baseline gap-2.5 px-5 py-2.5 hover:bg-stone-50"
                    >
                      <span className="text-sm font-medium text-stone-800">{t.term_bahasa || t.term}</span>
                      {t.term_bahasa && <span className="text-xs text-stone-400">{t.term}</span>}
                    </Link>
                  ))}
                </div>
              )}

              {matchedGuidelines.length > 0 && (
                <div className={matchedTerms.length > 0 ? 'border-t border-stone-100' : ''}>
                  <p className="px-5 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Guidelines</p>
                  {matchedGuidelines.map((g) => (
                    <Link
                      key={g.id}
                      href={`/guidelines/${g.slug}`}
                      onClick={close}
                      className="flex items-center px-5 py-2.5 hover:bg-stone-50"
                    >
                      <span className="text-sm font-medium text-stone-800">{g.title}</span>
                    </Link>
                  ))}
                </div>
              )}

              {matchedRules.length > 0 && (
                <div className={(matchedTerms.length > 0 || matchedGuidelines.length > 0) ? 'border-t border-stone-100' : ''}>
                  <p className="px-5 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-stone-400">Mechanics</p>
                  {matchedRules.map((r) => (
                    <Link
                      key={r.id}
                      href="/mechanics"
                      onClick={close}
                      className="flex items-center gap-3 px-5 py-2.5 hover:bg-stone-50"
                    >
                      <span className="text-sm font-medium text-stone-800">{r.rule}</span>
                      {r.category && (
                        <span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-400">{r.category}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t border-stone-100 px-5 py-2.5">
                <Link
                  href={`/glossary?q=${encodeURIComponent(query)}`}
                  onClick={close}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  See all glossary results for &ldquo;{query}&rdquo; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
