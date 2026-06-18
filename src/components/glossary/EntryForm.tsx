'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { termStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { GlossaryTerm } from '@/types'

interface EntryFormProps {
  entry?: GlossaryTerm
}

export default function EntryForm({ entry }: EntryFormProps) {
  const router = useRouter()
  const isEditing = !!entry

  const [term, setTerm] = useState(entry?.term ?? '')
  const [termBahasa, setTermBahasa] = useState(entry?.term_bahasa ?? '')
  const [definition, setDefinition] = useState(entry?.definition ?? '')
  const [avoid, setAvoid] = useState(entry?.avoid?.join(', ') ?? '')
  const [category, setCategory] = useState(entry?.category ?? '')
  const [tags, setTags] = useState(entry?.tags?.join(', ') ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(entry?.status ?? 'draft')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      term,
      term_bahasa: termBahasa || null,
      definition,
      avoid: avoid ? avoid.split(',').map((t) => t.trim()).filter(Boolean) : null,
      category: category || null,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
      status,
      created_by: null,
    }

    try {
      if (isEditing) {
        await termStore.update(entry.id, payload)
      } else {
        await termStore.create(payload)
      }
      router.push('/entries')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!entry || !confirm('Delete this entry? This cannot be undone.')) return
    setLoading(true)
    try {
      await termStore.delete(entry.id)
      router.push('/entries')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Term (English)"
          placeholder="e.g. Error state"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
        />
        <Input
          label="Term (Bahasa Indonesia)"
          placeholder="e.g. Status kesalahan"
          value={termBahasa}
          onChange={(e) => setTermBahasa(e.target.value)}
        />
      </div>
      <Textarea
        label="Definition"
        placeholder="Explain what this term means and how to use it…"
        rows={5}
        value={definition}
        onChange={(e) => setDefinition(e.target.value)}
        required
      />
      <Input
        label="Avoid (comma-separated)"
        placeholder="e.g. failure, broke, crashed"
        value={avoid}
        onChange={(e) => setAvoid(e.target.value)}
      />
      <Input
        label="Category"
        placeholder="e.g. UI Patterns"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Input
        label="Tags (comma-separated)"
        placeholder="e.g. forms, validation"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save changes' : 'Create entry'}
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
