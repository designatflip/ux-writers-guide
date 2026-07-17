'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const SECTIONS = [
  { key: 'glossary',   label: 'Word list & Glossary',       description: 'Terms, preferred spellings, and definitions' },
  { key: 'guidelines', label: 'Writing Guidelines',          description: 'Rules that keep our writing consistent' },
  { key: 'mechanics',  label: 'Punctuation & Mechanics',     description: 'Technical rules for polished writing' },
  { key: 'tone',       label: 'Tone of Voice Pillars',       description: 'How we sound in everything we write' },
] as const

type SectionKey = typeof SECTIONS[number]['key']
type Visibility = Record<SectionKey, boolean>

const DEFAULT: Visibility = { glossary: true, guidelines: true, mechanics: true, tone: true }

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${on ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function SectionVisibilitySettings() {
  const [visibility, setVisibility] = useState<Visibility>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'section_visibility')
        .single()
      if (data?.value) setVisibility({ ...DEFAULT, ...data.value })
      setLoading(false)
    }
    load()
  }, [])

  async function handleToggle(key: SectionKey, value: boolean) {
    const next = { ...visibility, [key]: value }
    setVisibility(next)
    setSaving(true)
    setSaved(false)
    try {
      const supabase = createClient()
      await supabase
        .from('site_settings')
        .upsert({ key: 'section_visibility', value: next, updated_at: new Date().toISOString() })
    } finally {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (loading) return <p className="text-sm text-slate-400">Loading…</p>

  return (
    <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Section Visibility</p>
          <p className="text-sm text-slate-500">Control which sections are visible on the public homepage.</p>
        </div>
        {saving && <span className="text-xs text-slate-400">Saving…</span>}
        {saved && !saving && <span className="text-xs text-green-600">Saved ✓</span>}
      </div>

      <div className="divide-y divide-slate-100">
        {SECTIONS.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between py-4">
            <div>
              <p className={`text-sm font-medium ${visibility[key] ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
              </p>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
            <Toggle on={visibility[key]} onChange={(v) => handleToggle(key, v)} />
          </div>
        ))}
      </div>
    </div>
  )
}
