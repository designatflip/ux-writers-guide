'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { tonePillarStore } from '@/lib/store'
import TonePillarForm from '@/components/TonePillarForm'
import type { TonePillar } from '@/types'

export default function EditTonePillarPage() {
  const { id } = useParams<{ id: string }>()
  const [pillar, setPillar] = useState<TonePillar | null>(null)

  useEffect(() => {
    tonePillarStore.list().then((pillars) => {
      setPillar(pillars.find((p) => p.id === id) ?? null)
    })
  }, [id])

  if (!pillar) return <p className="text-slate-500">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Tone Pillar</h1>
      <TonePillarForm pillar={pillar} />
    </div>
  )
}
