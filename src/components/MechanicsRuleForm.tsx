'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mechanicsRuleStore } from '@/lib/store'
import { MECHANICS_CATEGORIES } from '@/lib/mechanics-categories'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { MechanicsRule } from '@/types'

interface MechanicsRuleFormProps {
  rule?: MechanicsRule
}

export default function MechanicsRuleForm({ rule }: MechanicsRuleFormProps) {
  const router = useRouter()
  const isEditing = !!rule

  const [category, setCategory] = useState(rule?.category ?? '')
  const [ruleText, setRuleText] = useState(rule?.rule ?? '')
  const [example, setExample] = useState(rule?.example ?? '')
  const [dontExample, setDontExample] = useState(rule?.dont_example ?? '')
  const [description, setDescription] = useState(rule?.description ?? '')
  const [orderIndex, setOrderIndex] = useState(String(rule?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        category: category || null,
        rule: ruleText,
        example: example || null,
        dont_example: dontExample || null,
        description: description || null,
        order_index: parseInt(orderIndex) || 0,
      }
      if (isEditing) {
        await mechanicsRuleStore.update(rule.id, payload)
      } else {
        await mechanicsRuleStore.create(payload)
      }
      router.push('/entries/mechanics')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!rule || !confirm('Delete this rule? This cannot be undone.')) return
    setLoading(true)
    try {
      await mechanicsRuleStore.delete(rule.id)
      router.push('/entries/mechanics')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select a category…</option>
          {MECHANICS_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <Input
        label="Rule"
        placeholder="e.g. Always use the Oxford comma"
        value={ruleText}
        onChange={(e) => setRuleText(e.target.value)}
        required
      />

      <Input
        label="Do this ✓"
        placeholder="e.g. strategy, copy, and design"
        value={example}
        onChange={(e) => setExample(e.target.value)}
      />

      <Input
        label="Don't do this ✗"
        placeholder="e.g. strategy, copy and design"
        value={dontExample}
        onChange={(e) => setDontExample(e.target.value)}
      />

      <Textarea
        label="Description/Notes (optional)"
        placeholder="Explain when and why this rule applies…"
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
          {isEditing ? 'Save changes' : 'Create rule'}
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
