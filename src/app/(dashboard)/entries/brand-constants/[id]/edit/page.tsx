'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { brandConstantStore } from '@/lib/store'
import BrandConstantForm from '@/components/BrandConstantForm'
import type { BrandConstant } from '@/types'

export default function EditBrandConstantPage() {
  const { id } = useParams<{ id: string }>()
  const [constant, setConstant] = useState<BrandConstant | null>(null)

  useEffect(() => {
    brandConstantStore.list().then((constants) => {
      setConstant(constants.find((c) => c.id === id) ?? null)
    })
  }, [id])

  if (!constant) return <p className="text-slate-500">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Brand Constant</h1>
      <BrandConstantForm constant={constant} />
    </div>
  )
}
