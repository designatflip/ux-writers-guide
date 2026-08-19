'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { tonePillarStore, productStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { TonePillar, Product } from '@/types'

export default function DashboardTonePage() {
  const [pillars, setPillars] = useState<TonePillar[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [productFilter, setProductFilter] = useState('')

  async function load() {
    const [pillarsData, productsData] = await Promise.all([
      tonePillarStore.list(),
      productStore.list(),
    ])
    setPillars(pillarsData)
    setProducts(productsData)
  }

  useEffect(() => { load() }, [])

  const productName = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p.name]))
    return (id: string) => map.get(id) ?? '—'
  }, [products])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return pillars.filter((p) => {
      const matchSearch = !q || [p.title, p.description, p.do_example, p.dont_example].some(v => v?.toLowerCase().includes(q))
      const matchProduct = !productFilter || p.product_id === productFilter
      return matchSearch && matchProduct
    })
  }, [pillars, search, productFilter])

  const isFiltering = search !== '' || productFilter !== ''
  const newHref = productFilter ? `/entries/tone/new?product=${productFilter}` : '/entries/tone/new'

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tone of Voice</h1>
          <p className="text-sm text-neutral-600">Manage brand tone pillars per product</p>
        </div>
        <Link href={newHref}><Button>New pillar</Button></Link>
      </div>

      {pillars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="mb-4 text-neutral-600">No tone pillars yet.</p>
          <Link href={newHref}><Button>Create first pillar</Button></Link>
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
                placeholder="Search pillars…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-flip-orange-300 focus:outline-none focus:ring-2 focus:ring-flip-orange-100"
              />
            </div>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-flip-orange-300 focus:outline-none focus:ring-2 focus:ring-flip-orange-100"
            >
              <option value="">All products</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {isFiltering && (
              <span className="text-xs text-neutral-600">{filtered.length} of {pillars.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center">
              <p className="text-neutral-600">No pillars match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-600">Pillar</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Product</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Description</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Do&apos;s</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Don&apos;ts</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Order</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{p.title}</td>
                      <td className="px-4 py-3 text-neutral-600">{productName(p.product_id)}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-neutral-600">{p.description ?? '—'}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-neutral-600">{p.do_example ?? '—'}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-neutral-600">{p.dont_example ?? '—'}</td>
                      <td className="px-4 py-3 text-neutral-600">{p.order_index}</td>
                      <td className="px-4 py-3 text-neutral-600">{formatDate(p.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/tone/${p.id}/edit`} className="font-medium text-flip-orange hover:text-flip-orange-900">Edit</Link>
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
