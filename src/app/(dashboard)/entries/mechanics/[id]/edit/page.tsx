'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { mechanicsRuleStore } from '@/lib/store'
import MechanicsRuleForm from '@/components/MechanicsRuleForm'
import type { MechanicsRule } from '@/types'

export default function EditMechanicsRulePage() {
  const { id } = useParams<{ id: string }>()
  const [rule, setRule] = useState<MechanicsRule | null>(null)

  useEffect(() => {
    mechanicsRuleStore.list().then((rules) => {
      setRule(rules.find((r) => r.id === id) ?? null)
    })
  }, [id])

  if (!rule) return <p className="text-slate-500">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Mechanics Rule</h1>
      <MechanicsRuleForm rule={rule} />
    </div>
  )
}
