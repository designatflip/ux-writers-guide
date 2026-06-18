'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { tonePillarStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { TonePillar } from '@/types'

export default function DashboardTonePage() {
  const [pillars, setPillars] = useState<TonePillar[]>([])
  const [search, setSearch] = useState('')

  async function load() {
    setPillars(await tonePillarStore.list())
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return !q ? pillars : pillars.filter(p =>
      [p.title, p.description].some(v => v?.toLowerCase().includes(q))
    )
  }, [pillars, search])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tone of Voice</h1>
          <p className="text-sm text-slate-500">Manage brand tone pillars</p>
        </div>
        <Link href="/entries/tone/new"><Button>New pillar</Button></Link>
      </div>

      {pillars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          <p className="mb-4 text-slate-500">No tone pillars yet.</p>
          <Link href="/entries/tone/new"><Button>Create first pillar</Button></Link>
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
                placeholder="Search pillars…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {search && (
              <span className="text-xs text-slate-500">{filtered.length} of {pillars.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <p className="text-slate-500">No pillars match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">Pillar</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Description</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Order</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-500">{p.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{p.order_index}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(p.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/tone/${p.id}/edit`} className="font-medium text-indigo-600 hover:text-indigo-800">Edit</Link>
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
