'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { brandConstantStore, productStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { BrandConstant, Product } from '@/types'

export default function DashboardBrandConstantsPage() {
  const [constants, setConstants] = useState<BrandConstant[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [productFilter, setProductFilter] = useState('')

  async function load() {
    const [constantsData, productsData] = await Promise.all([
      brandConstantStore.list(),
      productStore.list(),
    ])
    setConstants(constantsData)
    setProducts(productsData)
  }

  useEffect(() => { load() }, [])

  const productName = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p.name]))
    return (id: string) => map.get(id) ?? '—'
  }, [products])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return constants.filter((c) => {
      const matchSearch = !q || [c.constant, c.heading, c.description].some(v => v?.toLowerCase().includes(q))
      const matchProduct = !productFilter || c.product_id === productFilter
      return matchSearch && matchProduct
    })
  }, [constants, search, productFilter])

  const isFiltering = search !== '' || productFilter !== ''
  const newHref = productFilter ? `/entries/brand-constants/new?product=${productFilter}` : '/entries/brand-constants/new'

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Brand Constants</h1>
          <p className="text-sm text-neutral-600">Manage brand constants and how they manifest per product</p>
        </div>
        <Link href={newHref}><Button>New brand constant</Button></Link>
      </div>

      {constants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="mb-4 text-neutral-600">No brand constants yet.</p>
          <Link href={newHref}><Button>Create first brand constant</Button></Link>
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
                placeholder="Search brand constants…"
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
              <span className="text-xs text-neutral-600">{filtered.length} of {constants.length}</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center">
              <p className="text-neutral-600">No brand constants match your search.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-600">Constant</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Product</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Heading</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Description</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Order</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{c.constant}</td>
                      <td className="px-4 py-3 text-neutral-600">{productName(c.product_id)}</td>
                      <td className="px-4 py-3 text-neutral-900">{c.heading}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-neutral-600">{c.description ?? '—'}</td>
                      <td className="px-4 py-3 text-neutral-600">{c.order_index}</td>
                      <td className="px-4 py-3 text-neutral-600">{formatDate(c.updated_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/entries/brand-constants/${c.id}/edit`} className="font-medium text-flip-orange hover:text-flip-orange-900">Edit</Link>
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
