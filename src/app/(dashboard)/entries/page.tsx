'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { termStore } from '@/lib/store'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CSVImportModal from '@/components/glossary/CSVImportModal'
import { formatDate } from '@/lib/utils'
import type { GlossaryTerm } from '@/types'

export default function EntriesPage() {
  const [entries, setEntries] = useState<GlossaryTerm[]>([])
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | 'draft' | 'published'>('')
  const [categoryFilter, setCategoryFilter] = useState('')

  async function loadEntries() {
    setEntries(await termStore.list())
  }

  useEffect(() => { loadEntries() }, [])

  const categories = useMemo(() =>
    [...new Set(entries.map(e => e.category).filter(Boolean) as string[])].sort()
  , [entries])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return entries.filter((e) => {
      const matchSearch = !q || [e.term, e.term_bahasa, e.definition].some(v => v?.toLowerCase().includes(q))
      const matchStatus = !statusFilter || e.status === statusFilter
      const matchCategory = !categoryFilter || e.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
  }, [entries, search, statusFilter, categoryFilter])

  const isFiltering = search !== '' || statusFilter !== '' || categoryFilter !== ''

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entries</h1>
          <p className="text-sm text-slate-500">Manage glossary terms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowImport(true)}>Import CSV</Button>
          <Link href="/entries/new"><Button>New entry</Button></Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          <p className="mb-4 text-slate-500">No entries yet.</p>
          <div className="flex justify-center gap-2">
            <Button variant="secondary" onClick={() => setShowImport(true)}>Import CSV</Button>
            <Link href="/entries/new"><Button>Create first entry</Button></Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-48">
              <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search terms…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as '' | 'draft' | 'published')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {isFiltering && (
              <span className="text-xs text-slate-500">{filtered.length} of {entries.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <p className="text-slate-500">No entries match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">Term</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Category</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{entry.term}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.category ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge color={entry.status === 'published' ? 'green' : 'amber'}>{entry.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(entry.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/${entry.id}/edit`} className="font-medium text-indigo-600 hover:text-indigo-800">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showImport && (
        <CSVImportModal onClose={() => setShowImport(false)} onImported={loadEntries} />
      )}
    </div>
  )
}
