'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { productStore, brandConstantStore, tonePillarStore } from '@/lib/store'
import { slugify } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Product } from '@/types'

interface ProductFormProps {
  product?: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [orderIndex, setOrderIndex] = useState(String(product?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleNameChange(val: string) {
    setName(val)
    if (!isEditing) setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        name,
        slug,
        order_index: parseInt(orderIndex) || 0,
      }
      if (isEditing) {
        await productStore.update(product.id, payload)
      } else {
        await productStore.create(payload)
      }
      router.push('/entries/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!product) return
    setLoading(true)
    try {
      const [constantsCount, pillarsCount] = await Promise.all([
        brandConstantStore.countByProduct(product.id),
        tonePillarStore.countByProduct(product.id),
      ])
      const message = constantsCount > 0 || pillarsCount > 0
        ? `Delete "${product.name}"? This will also delete ${constantsCount} brand constant${constantsCount === 1 ? '' : 's'} and ${pillarsCount} tone pillar${pillarsCount === 1 ? '' : 's'}. This cannot be undone.`
        : `Delete "${product.name}"? This cannot be undone.`
      if (!confirm(message)) { setLoading(false); return }
      await productStore.delete(product.id)
      router.push('/entries/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      <Input
        label="Name"
        placeholder="e.g. Flip Core"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        required
      />

      <Input
        label="Slug"
        placeholder="flip-core"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
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
          {isEditing ? 'Save changes' : 'Create product'}
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
