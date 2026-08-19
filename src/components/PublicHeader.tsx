import Link from 'next/link'

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="https://flip.id/assets/images/homepage-v2/flip-logo.png" alt="Flip" className="h-8 w-8" />
          <span className="text-sm font-bold text-neutral-900">Flip Communication Hub</span>
        </Link>

        <Link
          href="/glossary"
          className="flex flex-1 items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-200 max-w-lg"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Search terms, rules, guidelines...
        </Link>

        <nav className="ml-auto flex items-center gap-6">
          <Link href="/glossary" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Glossary
          </Link>
          <Link href="/guidelines" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Guidelines
          </Link>
          <Link href="/tone" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Tone
          </Link>
          <Link href="/mechanics" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Mechanics
          </Link>
          <Link href="/entries" className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
