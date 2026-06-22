'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import Input from '@/components/ui/Input'

interface GlossarySearchProps {
  categories: string[]
}

export default function GlossarySearch({ categories }: GlossarySearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentView = searchParams.get('view') ?? 'grid'
  const currentSort = searchParams.get('sort') ?? 'asc'

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search terms…"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
        />
      </div>

      {/* Category filter */}
      <select
        defaultValue={searchParams.get('category') ?? ''}
        onChange={(e) => updateParam('category', e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => updateParam('sort', e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
        <button
          onClick={() => updateParam('view', 'grid')}
          title="Grid view"
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            currentView === 'grid'
              ? 'bg-slate-100 text-slate-800'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="8" height="8" rx="1.5"/>
            <rect x="13" y="3" width="8" height="8" rx="1.5"/>
            <rect x="3" y="13" width="8" height="8" rx="1.5"/>
            <rect x="13" y="13" width="8" height="8" rx="1.5"/>
          </svg>
        </button>
        <button
          onClick={() => updateParam('view', 'list')}
          title="List view"
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            currentView === 'list'
              ? 'bg-slate-100 text-slate-800'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
