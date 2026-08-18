'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { brandConstantStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { BrandConstant } from '@/types'

interface BrandConstantFormProps {
  constant?: BrandConstant
}

export default function BrandConstantForm({ constant }: BrandConstantFormProps) {
  const router = useRouter()
  const isEditing = !!constant

  const [constantValue, setConstantValue] = useState(constant?.constant ?? '')
  const [heading, setHeading] = useState(constant?.heading ?? '')
  const [description, setDescription] = useState(constant?.description ?? '')
  const [orderIndex, setOrderIndex] = useState(String(constant?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
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

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
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
