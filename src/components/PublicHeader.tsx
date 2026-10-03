'use client'

import { useState } from 'react'
import Link from 'next/link'
import HomeSearch from '@/components/HomeSearch'
import type { SearchData } from '@/lib/search-data'

const NAV_LINKS = [
  { href: '/glossary', label: 'Glossary' },
  { href: '/guidelines', label: 'Component Guidelines' },
  { href: '/tone', label: 'Tone' },
  { href: '/mechanics', label: 'Mechanics' },
  { href: '/tools', label: 'Tools' },
  { href: '/entries', label: 'Dashboard' },
]

export default function PublicHeader({ searchData }: { searchData: SearchData }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="https://flip.id/assets/images/homepage-v2/flip-logo.png" alt="Flip" className="h-8 w-8 rounded-full object-cover object-left" />
          <span className="text-sm font-bold text-neutral-900">Flip Communication Hub</span>
        </Link>

        <div className="hidden flex-1 md:flex">
          <HomeSearch variant="compact" {...searchData} />
        </div>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                l.href === '/entries'
                  ? 'text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600'
                  : 'text-sm text-neutral-600 transition-colors hover:text-neutral-900'
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-50 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 px-6 py-4 md:hidden">
          <HomeSearch variant="compact" {...searchData} />
          <nav className="mt-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  l.href === '/entries'
                    ? 'rounded-lg px-2 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50'
                    : 'rounded-lg px-2 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
