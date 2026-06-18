'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { termStore } from '@/lib/store'
import EntryForm from '@/components/glossary/EntryForm'
import type { GlossaryTerm } from '@/types'

export default function EditEntryPage() {
  const { id } = useParams<{ id: string }>()
  const [entry, setEntry] = useState<GlossaryTerm | null | 'loading'>('loading')

  useEffect(() => {
    termStore.list().then((terms) => {
      setEntry(terms.find((t) => t.id === id) ?? null)
    })
  }, [id])

  if (entry === 'loading') return null
  if (!entry) return notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Entry</h1>
      <EntryForm entry={entry} />
    </div>
  )
}
