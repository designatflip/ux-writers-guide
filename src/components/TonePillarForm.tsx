'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { tonePillarStore, productStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { TonePillar, Product } from '@/types'

interface TonePillarFormProps {
  pillar?: TonePillar
}

export default function TonePillarForm({ pillar }: TonePillarFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditing = !!pillar
  const fileRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState(pillar?.product_id ?? '')
  const [title, setTitle] = useState(pillar?.title ?? '')
  const [description, setDescription] = useState(pillar?.description ?? '')
  const [doExample, setDoExample] = useState(pillar?.do_example ?? '')
  const [dontExample, setDontExample] = useState(pillar?.dont_example ?? '')
  const [orderIndex, setOrderIndex] = useState(String(pillar?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
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

  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setConverting(true)
    try {
      const buffer = await file.arrayBuffer()
      const mammoth = (await import('mammoth')).default
      const TurndownService = (await import('turndown')).default
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer })
      const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' })
      setDescription(td.turndown(html))
      if (!title) setTitle(file.name.replace(/\.docx$/i, ''))
    } catch {
      setError('Failed to convert document. Make sure it is a valid .docx file.')
    } finally {
      setConverting(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        product_id: productId,
        title,
        description: description || null,
        do_example: doExample || null,
        dont_example: dontExample || null,
        order_index: parseInt(orderIndex) || 0,
      }
      if (isEditing) {
        await tonePillarStore.update(pillar.id, payload)
      } else {
        await tonePillarStore.create(payload)
      }
      router.push('/entries/tone')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!pillar || !confirm('Delete this pillar? This cannot be undone.')) return
    setLoading(true)
    try {
      await tonePillarStore.delete(pillar.id)
      router.push('/entries/tone')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (products.length === 0) {
    return (
      <div className="max-w-xl rounded-xl border border-dashed border-neutral-200 py-12 text-center">
        <p className="mb-4 text-neutral-600">No products yet — create one first.</p>
        <Link href="/entries/products/new"><Button>Create product</Button></Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-900">
          Product <span className="text-crimson">*</span>
        </label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-flip-orange-300 focus:outline-none focus:ring-2 focus:ring-flip-orange-100"
        >
          <option value="">Select a product…</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <Input
        label="Pillar title"
        placeholder="e.g. Clear, not clever"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-900">Description (optional)</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={converting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
          >
            {converting ? (
              <>
                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Converting…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload .docx
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleDocUpload}
          />
        </div>
        <Textarea
          placeholder="Explain what this pillar means and how to apply it, or upload a .docx file above…"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Textarea
        label="Do's example (optional)"
        placeholder={'e.g. "Ada biaya Rp6.500 untuk transfer ini. Mau lanjut?"'}
        rows={2}
        value={doExample}
        onChange={(e) => setDoExample(e.target.value)}
      />

      <Textarea
        label="Don'ts example (optional)"
        placeholder={'e.g. "Mungkin dikenakan biaya tambahan."'}
        rows={2}
        value={dontExample}
        onChange={(e) => setDontExample(e.target.value)}
      />

      <Input
        label="Order index"
        type="number"
        min={0}
        value={orderIndex}
        onChange={(e) => setOrderIndex(e.target.value)}
      />

      {error && <p className="text-sm text-crimson">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save changes' : 'Create pillar'}
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
