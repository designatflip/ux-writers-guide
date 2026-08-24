import Link from 'next/link'
import HomeSearch from '@/components/HomeSearch'
import type { SearchData } from '@/lib/search-data'

export default function PublicHeader({ searchData }: { searchData: SearchData }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="https://flip.id/assets/images/homepage-v2/flip-logo.png" alt="Flip" className="h-8 w-8" />
          <span className="text-sm font-bold text-neutral-900">Flip Communication Hub</span>
        </Link>

        <HomeSearch
          variant="compact"
          terms={searchData.terms}
          guidelines={searchData.guidelines}
          rules={searchData.rules}
          pillars={searchData.pillars}
          products={searchData.products}
        />

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
