'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { guidelineStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import GuidelineCSVImportModal from '@/components/GuidelineCSVImportModal'
import { formatDate } from '@/lib/utils'
import type { Guideline } from '@/types'

export default function DashboardGuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([])
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')

  async function loadGuidelines() {
    setGuidelines(await guidelineStore.list())
  }

  useEffect(() => { loadGuidelines() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return !q ? guidelines : guidelines.filter(g =>
      [g.title, g.slug].some(v => v?.toLowerCase().includes(q))
    )
  }, [guidelines, search])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guidelines</h1>
          <p className="text-sm text-slate-500">Manage writing guidelines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowImport(true)}>Import CSV</Button>
          <Link href="/entries/guidelines/new"><Button>New guideline</Button></Link>
        </div>
      </div>

      {guidelines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          <p className="mb-4 text-slate-500">No guidelines yet.</p>
          <div className="flex justify-center gap-2">
            <Button variant="secondary" onClick={() => setShowImport(true)}>Import CSV</Button>
            <Link href="/entries/guidelines/new"><Button>Create first guideline</Button></Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search guidelines…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {search && (
              <span className="text-xs text-slate-500">{filtered.length} of {guidelines.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <p className="text-slate-500">No guidelines match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">Title</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Slug</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Order</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{g.title}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{g.slug}</td>
                      <td className="px-4 py-3 text-slate-600">{g.order_index}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(g.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/guidelines/${g.slug}/edit`} className="font-medium text-indigo-600 hover:text-indigo-800">Edit</Link>
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
        <GuidelineCSVImportModal onClose={() => setShowImport(false)} onImported={loadGuidelines} />
      )}
    </div>
  )
}
