'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { mechanicsRuleStore } from '@/lib/store'
import { MECHANICS_CATEGORIES } from '@/lib/mechanics-categories'
import Button from '@/components/ui/Button'
import MechanicsCSVImportModal from '@/components/MechanicsCSVImportModal'
import { formatDate } from '@/lib/utils'
import type { MechanicsRule } from '@/types'

export default function DashboardMechanicsPage() {
  const [rules, setRules] = useState<MechanicsRule[]>([])
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  async function load() {
    setRules(await mechanicsRuleStore.list())
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rules.filter((r) => {
      const matchSearch = !q || [r.rule, r.example, r.dont_example, r.description, r.data ? JSON.stringify(r.data) : null].some(v => v?.toLowerCase().includes(q))
      const matchCategory = !categoryFilter || r.category === categoryFilter
      return matchSearch && matchCategory
    })
  }, [rules, search, categoryFilter])

  const isFiltering = search !== '' || categoryFilter !== ''

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Mechanics</h1>
          <p className="text-sm text-neutral-600">Manage punctuation and writing rules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowImport(true)}>Import CSV</Button>
          <Link href="/entries/mechanics/new"><Button>New rule</Button></Link>
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="mb-4 text-neutral-600">No mechanics rules yet.</p>
          <div className="flex justify-center gap-2">
            <Button variant="secondary" onClick={() => setShowImport(true)}>Import CSV</Button>
            <Link href="/entries/mechanics/new"><Button>Create first rule</Button></Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-48">
              <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search rules…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-flip-orange-300 focus:outline-none focus:ring-2 focus:ring-flip-orange-100"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-flip-orange-300 focus:outline-none focus:ring-2 focus:ring-flip-orange-100"
            >
              <option value="">All categories</option>
              {MECHANICS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {isFiltering && (
              <span className="text-xs text-neutral-600">{filtered.length} of {rules.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center">
              <p className="text-neutral-600">No rules match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-600">Rule</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Category</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Do ✓</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Order</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{r.rule}</td>
                      <td className="px-4 py-3 text-neutral-600">{r.category ?? '—'}</td>
                      <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-neutral-600">{r.example ?? '—'}</td>
                      <td className="px-4 py-3 text-neutral-600">{r.order_index}</td>
                      <td className="px-4 py-3 text-neutral-600">{formatDate(r.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/mechanics/${r.id}/edit`} className="font-medium text-flip-orange hover:text-flip-orange-900">Edit</Link>
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
        <MechanicsCSVImportModal onClose={() => setShowImport(false)} onImported={load} />
      )}
    </div>
  )
}
