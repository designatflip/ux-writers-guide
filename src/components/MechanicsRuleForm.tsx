'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mechanicsRuleStore } from '@/lib/store'
import { MECHANICS_CATEGORIES, getMechanicsFormKind } from '@/lib/mechanics-categories'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import CapitalizationFormFields from '@/components/mechanics/CapitalizationFormFields'
import RepeaterFormFields from '@/components/mechanics/RepeaterFormFields'
import type { MechanicsRule, RuleEntry, ExampleItem, CapitalizationData, RepeaterData } from '@/types'

interface MechanicsRuleFormProps {
  rule?: MechanicsRule
}

function migrateExamples(raw: unknown[]): ExampleItem[] {
  return raw.map((item) =>
    typeof item === 'string'
      ? { type: 'text' as const, content: item }
      : (item as ExampleItem)
  )
}

function blankRepeaterFromLegacy(rule?: MechanicsRule): RuleEntry[] {
  if (!rule) return [{ ruleText: '', doExamples: [], dontExamples: [] }]
  if (rule.data?.kind === 'repeater') {
    return rule.data.rules.map((r) => ({
      ...r,
      doExamples: migrateExamples(r.doExamples as unknown[]),
      dontExamples: migrateExamples(r.dontExamples as unknown[]),
    }))
  }
  return [{
    ruleText: '',
    doExamples: rule.example ? [{ type: 'text', content: rule.example }] : [],
    dontExamples: rule.dont_example ? [{ type: 'text', content: rule.dont_example }] : [],
  }]
}

function initCapitalization(rule?: MechanicsRule) {
  if (rule?.data?.kind === 'capitalization') return rule.data
  return { textComponents: [] as string[], uiComponents: [] as string[] }
}

export default function MechanicsRuleForm({ rule }: MechanicsRuleFormProps) {
  const router = useRouter()
  const isEditing = !!rule

  const [category, setCategory] = useState(rule?.category ?? '')
  const [ruleText, setRuleText] = useState(rule?.rule ?? '')
  const [orderIndex, setOrderIndex] = useState(String(rule?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Capitalization-specific
  const initCap = initCapitalization(rule)
  const [description, setDescription] = useState(rule?.description ?? '')
  const [textComponents, setTextComponents] = useState<string[]>(initCap.textComponents)
  const [uiComponents, setUiComponents] = useState<string[]>(initCap.uiComponents)

  // Repeater-specific
  const [repeaterRules, setRepeaterRules] = useState<RuleEntry[]>(blankRepeaterFromLegacy(rule))

  const currentKind = category ? getMechanicsFormKind(category) : null

  function handleCategoryChange(newCategory: string) {
    if (!newCategory) { setCategory(''); return }
    const newKind = getMechanicsFormKind(newCategory)
    if (currentKind && newKind !== currentKind) {
      // Reset structured state when switching between form kinds
      setDescription('')
      setTextComponents([])
      setUiComponents([])
      setRepeaterRules([{ ruleText: '', doExamples: [], dontExamples: [] }])
    }
    setCategory(newCategory)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) { setError('Please select a category'); return }
    setLoading(true)
    setError('')

    try {
      const kind = getMechanicsFormKind(category)
      let data: CapitalizationData | RepeaterData
      let example: string | null = null
      let dontExample: string | null = null

      if (kind === 'capitalization') {
        data = { kind: 'capitalization', textComponents, uiComponents }
      } else {
        data = { kind: 'repeater', rules: repeaterRules }
        // Populate flat columns from first text example for list-view compat
        const firstDo = repeaterRules[0]?.doExamples.find(e => e.type === 'text')
        const firstDont = repeaterRules[0]?.dontExamples.find(e => e.type === 'text')
        example = firstDo?.type === 'text' ? firstDo.content : null
        dontExample = firstDont?.type === 'text' ? firstDont.content : null
      }

      const payload = {
        category,
        rule: ruleText,
        description: kind === 'capitalization' ? (description || null) : null,
        example,
        dont_example: dontExample,
        order_index: parseInt(orderIndex) || 0,
        data,
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

  const typePlaceholder =
    currentKind === 'capitalization' ? 'e.g. Sentence case'
    : currentKind === 'repeater' ? 'e.g. Period, Bold, Decimal…'
    : 'Select a category first'

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          required
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select a category…</option>
          {MECHANICS_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Type / label */}
      <Input
        label={currentKind === 'capitalization' ? 'Capitalization type' : 'Type'}
        placeholder={typePlaceholder}
        value={ruleText}
        onChange={(e) => setRuleText(e.target.value)}
        required
        disabled={!category}
      />

      {/* Category-specific fields */}
      {currentKind === 'capitalization' && (
        <CapitalizationFormFields
          description={description}
          textComponents={textComponents}
          uiComponents={uiComponents}
          onDescriptionChange={setDescription}
          onTextComponentsChange={setTextComponents}
          onUiComponentsChange={setUiComponents}
        />
      )}

      {currentKind === 'repeater' && (
        <RepeaterFormFields
          rules={repeaterRules}
          onChange={setRepeaterRules}
        />
      )}

      {/* Order index */}
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
