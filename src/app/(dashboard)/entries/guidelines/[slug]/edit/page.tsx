'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { guidelineStore } from '@/lib/store'
import GuidelineForm from '@/components/GuidelineForm'
import type { Guideline } from '@/types'

export default function EditGuidelinePage() {
  const { slug } = useParams<{ slug: string }>()
  const [guideline, setGuideline] = useState<Guideline | null | 'loading'>('loading')

  useEffect(() => {
    guidelineStore.list().then((guidelines) => {
      setGuideline(guidelines.find((g) => g.slug === slug) ?? null)
    })
  }, [slug])

  if (guideline === 'loading') return null
  if (!guideline) return notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Guideline</h1>
      <GuidelineForm guideline={guideline} />
    </div>
  )
}
