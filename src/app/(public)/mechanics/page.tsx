import { createClient } from '@/lib/supabase/server'
import { MECHANICS_CATEGORIES } from '@/lib/mechanics-categories'
import type { MechanicsRule, CapitalizationData, RepeaterData } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Mechanics — Flip Communication Hub' }

// ── Card variants ─────────────────────────────────────────────────────────────

function LegacyRuleCard({ rule }: { rule: MechanicsRule }) {
  return (
    <div
      className="rounded-xl border border-indigo-100 p-5 transition-all hover:border-indigo-200 hover:shadow-sm"
      style={{ backgroundColor: '#f5f3ff' }}
    >
      <p className="mb-3 text-sm font-semibold text-slate-800">{rule.rule}</p>
      {(rule.example || rule.dont_example) && (
        <div className={`grid gap-2 ${rule.example && rule.dont_example ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {rule.example && (
            <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
              <p className="mb-1 text-xs font-medium text-green-600">Do this ✓</p>
              <p className="font-mono text-sm text-slate-700">{rule.example}</p>
            </div>
          )}
          {rule.dont_example && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
              <p className="mb-1 text-xs font-medium text-red-500">Don't do this ✗</p>
              <p className="font-mono text-sm text-slate-700">{rule.dont_example}</p>
            </div>
          )}
        </div>
      )}
      {rule.description && (
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{rule.description}</p>
      )}
    </div>
  )
}

function CapitalizationCard({ rule }: { rule: MechanicsRule }) {
  const data = rule.data as CapitalizationData
  return (
    <div
      className="rounded-xl border border-indigo-100 p-5 transition-all hover:border-indigo-200 hover:shadow-sm"
      style={{ backgroundColor: '#f5f3ff' }}
    >
      <p className="mb-1 text-sm font-semibold text-slate-800">{rule.rule}</p>
      {rule.description && (
        <p className="mb-4 text-sm text-slate-500">{rule.description}</p>
      )}
      {(data.textComponents.length > 0 || data.uiComponents.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {data.textComponents.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Text components</p>
              <ul className="space-y-1">
                {data.textComponents.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.uiComponents.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">UI components</p>
              <ul className="space-y-1">
                {data.uiComponents.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RepeaterCard({ rule }: { rule: MechanicsRule }) {
  const data = rule.data as RepeaterData
  return (
    <div
      className="rounded-xl border border-indigo-100 p-5 transition-all hover:border-indigo-200 hover:shadow-sm"
      style={{ backgroundColor: '#f5f3ff' }}
    >
      <p className="mb-3 text-sm font-semibold text-slate-800">{rule.rule}</p>
      <div className="space-y-4">
        {data.rules.map((entry, i) => (
          <div key={i} className={i > 0 ? 'border-t border-slate-200 pt-4' : ''}>
            {entry.ruleText && (
              <p className="mb-2 text-sm font-medium text-slate-700">{entry.ruleText}</p>
            )}
            {(entry.doExamples.length > 0 || entry.dontExamples.length > 0) && (
              <div className={`grid gap-2 ${entry.doExamples.length > 0 && entry.dontExamples.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {entry.doExamples.length > 0 && (
                  <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
                    <p className="mb-1 text-xs font-medium text-green-600">Do this ✓</p>
                    <ul className="space-y-0.5">
                      {entry.doExamples.map((ex, j) => (
                        <li key={j} className="font-mono text-sm text-slate-700">{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {entry.dontExamples.length > 0 && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                    <p className="mb-1 text-xs font-medium text-red-500">Don't do this ✗</p>
                    <ul className="space-y-0.5">
                      {entry.dontExamples.map((ex, j) => (
                        <li key={j} className="font-mono text-sm text-slate-700">{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MechanicsRuleCard({ rule }: { rule: MechanicsRule }) {
  if (!rule.data) return <LegacyRuleCard rule={rule} />
  if (rule.data.kind === 'capitalization') return <CapitalizationCard rule={rule} />
  return <RepeaterCard rule={rule} />
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MechanicsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('mechanics_rules')
    .select('*')
    .order('order_index', { ascending: true })

  const rules = data ?? []

  const categoryOrder = (cat: string | null) => {
    const idx = MECHANICS_CATEGORIES.indexOf(cat as never)
    return idx === -1 ? 999 : idx
  }
  const sorted = [...rules].sort((a, b) => {
    const diff = categoryOrder(a.category) - categoryOrder(b.category)
    return diff !== 0 ? diff : (a.order_index ?? 0) - (b.order_index ?? 0)
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Mechanics</h1>
        <p className="text-slate-500">The technical rules that keep our writing polished across every channel.</p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-slate-500">No mechanics rules published yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((r, i) => {
            const prevCategory = i > 0 ? sorted[i - 1].category : null
            const showHeading = r.category && r.category !== prevCategory
            return (
              <div key={r.id}>
                {showHeading && (
                  <h2 className={`${i > 0 ? 'mt-8' : ''} mb-3 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900`}>
                    {r.category}
                  </h2>
                )}
                <MechanicsRuleCard rule={r as MechanicsRule} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
