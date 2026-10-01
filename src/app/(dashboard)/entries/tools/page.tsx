'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { toolStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { Tool } from '@/types'

export default function DashboardToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [search, setSearch] = useState('')

  async function load() {
    setTools(await toolStore.list())
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return !q ? tools : tools.filter(t =>
      [t.name, t.type].some(v => v?.toLowerCase().includes(q))
    )
  }, [tools, search])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tools</h1>
          <p className="text-sm text-neutral-600">Manage the tools shown on the public Tools page</p>
        </div>
        <Link href="/entries/tools/new"><Button>New tool</Button></Link>
      </div>

      {tools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="mb-4 text-neutral-600">No tools yet.</p>
          <Link href="/entries/tools/new"><Button>Create first tool</Button></Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search tools…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-flip-orange-300 focus:outline-none focus:ring-2 focus:ring-flip-orange-100"
              />
            </div>
            {search && (
              <span className="text-xs text-neutral-600">{filtered.length} of {tools.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center">
              <p className="text-neutral-600">No tools match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Type</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Access</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Order</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{t.name}</td>
                      <td className="px-4 py-3 text-neutral-600">{t.type}</td>
                      <td className="px-4 py-3 text-neutral-600">{t.link_type}</td>
                      <td className="px-4 py-3 text-neutral-600">{t.order_index}</td>
                      <td className="px-4 py-3 text-neutral-600">{formatDate(t.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/tools/${t.id}/edit`} className="font-medium text-flip-orange hover:text-flip-orange-900">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
