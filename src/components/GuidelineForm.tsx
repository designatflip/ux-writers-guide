'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { guidelineStore } from '@/lib/store'
import { slugify } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { Guideline } from '@/types'

interface GuidelineFormProps {
  guideline?: Guideline
}

export default function GuidelineForm({ guideline }: GuidelineFormProps) {
  const router = useRouter()
  const isEditing = !!guideline
  const fileRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(guideline?.title ?? '')
  const [slug, setSlug] = useState(guideline?.slug ?? '')
  const [content, setContent] = useState(guideline?.content ?? '')
  const [orderIndex, setOrderIndex] = useState(String(guideline?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEditing) setSlug(slugify(val))
  }

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
      setContent(td.turndown(html))
      if (!title) {
        const name = file.name.replace(/\.docx$/i, '')
        handleTitleChange(name)
      }
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

    const payload = {
      title,
      slug,
      content: content || null,
      order_index: parseInt(orderIndex) || 0,
      created_by: null,
    }

    try {
      if (isEditing) {
        await guidelineStore.update(guideline.id, payload)
      } else {
        await guidelineStore.create(payload)
      }
      router.push('/entries/guidelines')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!guideline || !confirm('Delete this guideline? This cannot be undone.')) return
    setLoading(true)
    try {
      await guidelineStore.delete(guideline.id)
      router.push('/entries/guidelines')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-2xl space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Writing for errors"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        required
      />
      <Input
        label="Slug"
        placeholder="writing-for-errors"
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

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Content</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={converting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
          >
            {converting ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
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
          placeholder="Write the guideline content here, or upload a .docx file above…"
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save changes' : 'Create guideline'}
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
