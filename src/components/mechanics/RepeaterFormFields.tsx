'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { RuleEntry, ExampleItem } from '@/types'

// ── ExampleList ───────────────────────────────────────────────────────────────

interface ExampleListProps {
  label: string
  accent: 'green' | 'red'
  items: ExampleItem[]
  onChange: (items: ExampleItem[]) => void
}

function ExampleList({ label, accent, items, onChange }: ExampleListProps) {
  const [uploading, setUploading] = useState<Set<number>>(new Set())

  function addText() { onChange([...items, { type: 'text', content: '' }]) }
  function addImage() { onChange([...items, { type: 'image', url: '' }]) }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)) }
  function updateText(i: number, content: string) {
    onChange(items.map((item, idx) => idx === i ? { type: 'text' as const, content } : item))
  }

  async function handleFile(i: number, file: File) {
    setUploading((prev) => new Set(prev).add(i))
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'png'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('mechanics-images').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('mechanics-images').getPublicUrl(path)
      onChange(items.map((item, idx) => idx === i ? { type: 'image' as const, url: publicUrl } : item))
    } catch (err) {
      console.error('Image upload failed:', err)
    } finally {
      setUploading((prev) => { const s = new Set(prev); s.delete(i); return s })
    }
  }

  const wrapColor = accent === 'green'
    ? 'border-green-200 bg-green-50/60'
    : 'border-red-200 bg-red-50/60'
  const labelColor = accent === 'green' ? 'text-green-700' : 'text-red-600'

  return (
    <div>
      <p className={`mb-2 text-sm font-medium ${labelColor}`}>{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className={`relative rounded-lg border ${wrapColor} p-3`}>
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-white/80 hover:text-slate-600"
            >
              ×
            </button>

            {item.type === 'text' ? (
              <textarea
                value={item.content}
                onChange={(e) => updateText(i, e.target.value)}
                placeholder="Add example text…"
                rows={2}
                className="w-full resize-none bg-transparent pr-6 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
              />
            ) : (
              <div className="pr-6">
                {uploading.has(i) ? (
                  <p className="py-4 text-center text-xs text-slate-400">Uploading…</p>
                ) : item.url ? (
                  <div className="space-y-2">
                    <img src={item.url} alt="example" className="max-h-40 rounded object-contain" />
                    <label className="cursor-pointer text-xs font-medium text-indigo-500 hover:text-indigo-700">
                      Replace image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(i, f) }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-1.5 py-5 text-slate-400 hover:text-slate-600">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="m21 15-5-5L5 21"/>
                    </svg>
                    <span className="text-xs">Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(i, f) }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={addText}
          className="flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700"
        >
          + Add text
        </button>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700"
        >
          + Add image
        </button>
      </div>
    </div>
  )
}

// ── RepeaterFormFields ────────────────────────────────────────────────────────

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
    const next = [...rules];
    [next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  function moveDown(i: number) {
    if (i === rules.length - 1) return
    const next = [...rules];
    [next[i], next[i + 1]] = [next[i + 1], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {rules.map((rule, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-600">
                {i + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rule</span>
            </div>
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
                  onClick={() => onChange(rules.filter((_, idx) => idx !== i))}
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

          <ExampleList
            label="Do this ✓"
            accent="green"
            items={rule.doExamples}
            onChange={(doExamples) => onChange(update(rules, i, { doExamples }))}
          />

          <ExampleList
            label="Don't do this ✗"
            accent="red"
            items={rule.dontExamples}
            onChange={(dontExamples) => onChange(update(rules, i, { dontExamples }))}
          />
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={() => onChange([...rules, blank()])}>
        + Add rule
      </Button>
    </div>
  )
}
