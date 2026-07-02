'use client'

import Input from '@/components/ui/Input'
import TagInput from '@/components/ui/TagInput'
import Button from '@/components/ui/Button'
import type { RuleEntry } from '@/types'

interface RepeaterFormFieldsProps {
  rules: RuleEntry[]
  onChange: (rules: RuleEntry[]) => void
}

function blank(): RuleEntry {
  return { ruleText: '', doExamples: [], dontExamples: [] }
}

function update(rules: RuleEntry[], index: number, patch: Partial<RuleEntry>): RuleEntry[] {
  return rules.map((r, i) => (i === index ? { ...r, ...patch } : r))
}

export default function RepeaterFormFields({ rules, onChange }: RepeaterFormFieldsProps) {
  function moveUp(i: number) {
    if (i === 0) return
    const next = [...rules]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  function moveDown(i: number) {
    if (i === rules.length - 1) return
    const next = [...rules]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  function remove(i: number) {
    onChange(rules.filter((_, idx) => idx !== i))
  }

  function addRule() {
    onChange([...rules, blank()])
  }

  return (
    <div className="space-y-3">
      {rules.map((rule, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Rule {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === rules.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              {rules.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="ml-1 flex h-6 items-center rounded px-2 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <Input
            label="Rule"
            placeholder="Describe the rule…"
            value={rule.ruleText}
            onChange={(e) => onChange(update(rules, i, { ruleText: e.target.value }))}
          />

          <TagInput
            label="Do this ✓"
            items={rule.doExamples}
            onChange={(doExamples) => onChange(update(rules, i, { doExamples }))}
            placeholder="Add example — press Enter"
          />

          <TagInput
            label="Don't do this ✗"
            items={rule.dontExamples}
            onChange={(dontExamples) => onChange(update(rules, i, { dontExamples }))}
            placeholder="Add example — press Enter"
          />
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addRule}>
        + Add rule
      </Button>
    </div>
  )
}
