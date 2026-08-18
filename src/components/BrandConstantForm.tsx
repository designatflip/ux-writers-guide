'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { brandConstantStore, productStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { BrandConstant, Product } from '@/types'

interface BrandConstantFormProps {
  constant?: BrandConstant
}

export default function BrandConstantForm({ constant }: BrandConstantFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditing = !!constant

  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState(constant?.product_id ?? '')
  const [constantValue, setConstantValue] = useState(constant?.constant ?? '')
  const [heading, setHeading] = useState(constant?.heading ?? '')
  const [description, setDescription] = useState(constant?.description ?? '')
  const [orderIndex, setOrderIndex] = useState(String(constant?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    productStore.list().then((list) => {
      setProducts(list)
      if (!isEditing) {
        const fromQuery = searchParams.get('product')
        if (fromQuery && list.some((p) => p.id === fromQuery)) setProductId(fromQuery)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        product_id: productId,
        constant: constantValue,
        heading,
        description: description || null,
        order_index: parseInt(orderIndex) || 0,
      }
      if (isEditing) {
        await brandConstantStore.update(constant.id, payload)
      } else {
        await brandConstantStore.create(payload)
      }
      router.push('/entries/brand-constants')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!constant || !confirm('Delete this brand constant? This cannot be undone.')) return
    setLoading(true)
    try {
      await brandConstantStore.delete(constant.id)
      router.push('/entries/brand-constants')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (products.length === 0) {
    return (
      <div className="max-w-xl rounded-xl border border-dashed border-slate-200 py-12 text-center">
        <p className="mb-4 text-slate-500">No products yet — create one first.</p>
        <Link href="/entries/products/new"><Button>Create product</Button></Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          Product <span className="text-red-500">*</span>
        </label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select a product…</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <Input
        label="Brand constant"
        placeholder="e.g. Fair"
        value={constantValue}
        onChange={(e) => setConstantValue(e.target.value)}
        required
      />

      <Input
        label="Manifestation heading"
        placeholder="e.g. No hidden fees"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        required
      />

      <Textarea
        label="Manifestation description (optional)"
        placeholder="e.g. Every cost is visible before the user commits."
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        label="Order index"
        type="number"
        min={0}
        value={orderIndex}
        onChange={(e) => setOrderIndex(e.target.value)}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save changes' : 'Create brand constant'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        {isEditing && (
          <Button type="button" variant="danger" className="ml-auto" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
