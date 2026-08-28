import { createClient } from '@/lib/supabase/server'
import { MECHANICS_CATEGORIES } from '@/lib/mechanics-categories'
import { getSectionVisibility } from '@/lib/site-settings'
import Badge from '@/components/ui/Badge'
import type { MechanicsRule, ExampleItem, CapitalizationData, RepeaterData } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Mechanics — Flip Communication Hub' }

// ── Category accent colors ──────────────────────────────────────────────────────
// Jade/crimson are reserved site-wide for Do/Don't semantics, so category accents
// draw from the rest of the brand palette instead.

const CATEGORY_ACCENT: Record<string, string> = {
  'Punctuation': '#5786CC', // sapphire
  'Capitalization': '#FFB207', // golden
  'Numbering/Date & Time': '#B01D88', // mauve
  'Text Formatting': '#FD6542', // flip orange
}
const DEFAULT_ACCENT = '#AAABAD' // neutral-400

function getAccent(category: string | null) {
  return (category && CATEGORY_ACCENT[category]) || DEFAULT_ACCENT
}

// ── Card variants ─────────────────────────────────────────────────────────────

function RuleCardShell({ category, children }: { category: string | null; children: React.ReactNode }) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-sm">
      <div className="w-1 shrink-0" style={{ backgroundColor: getAccent(category) }} />
      <div className="min-w-0 flex-1 p-5">{children}</div>
    </div>
  )
}

function LegacyRuleCard({ rule }: { rule: MechanicsRule }) {
  return (
    <RuleCardShell category={rule.category}>
      <p className="mb-3 text-sm font-semibold text-neutral-900">{rule.rule}</p>
      {(rule.example || rule.dont_example) && (
        <div className={`grid gap-2 ${rule.example && rule.dont_example ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {rule.example && (
            <div className="rounded-lg border border-jade-100 bg-jade-100 px-3 py-2">
              <Badge color="green">Do ✓</Badge>
              <p className="mt-1.5 font-mono text-sm text-neutral-900">{rule.example}</p>
            </div>
          )}
          {rule.dont_example && (
            <div className="rounded-lg border border-crimson-100 bg-crimson-100 px-3 py-2">
              <Badge color="red">Don&apos;t ✗</Badge>
              <p className="mt-1.5 font-mono text-sm text-neutral-900">{rule.dont_example}</p>
            </div>
          )}
        </div>
      )}
      {rule.description && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{rule.description}</p>
      )}
    </RuleCardShell>
  )
}

function CapitalizationCard({ rule }: { rule: MechanicsRule }) {
  const data = rule.data as CapitalizationData
  return (
    <RuleCardShell category={rule.category}>
      <p className="mb-1 text-sm font-semibold text-neutral-900">{rule.rule}</p>
      {rule.description && (
        <p className="mb-4 text-sm text-neutral-600">{rule.description}</p>
      )}
      {(data.textComponents.length > 0 || data.uiComponents.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {data.textComponents.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Text components</p>
              <ul className="space-y-1">
                {data.textComponents.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-neutral-900">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-flip-orange-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.uiComponents.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">UI components</p>
              <ul className="space-y-1">
                {data.uiComponents.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-neutral-900">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-flip-orange-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </RuleCardShell>
  )
}

function renderExampleItem(item: ExampleItem | string, j: number) {
  // Handle legacy string format stored before the ExampleItem migration
  if (typeof item === 'string') {
    return <p key={j} className="font-mono text-sm text-neutral-900">{item}</p>
  }
  if (item.type === 'image') {
    return <img key={j} src={item.url} alt="" className="max-h-48 rounded object-contain" />
  }
  return <p key={j} className="font-mono text-sm text-neutral-900">{item.content}</p>
}

function RepeaterCard({ rule }: { rule: MechanicsRule }) {
  const data = rule.data as RepeaterData
  const accent = getAccent(rule.category)
  return (
    <RuleCardShell category={rule.category}>
      <p className="mb-3 text-sm font-semibold text-neutral-900">{rule.rule}</p>
      <div className="space-y-3">
        {data.rules.map((entry, i) => (
          <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
            {entry.ruleText && (
              <div className="mb-2 flex items-baseline gap-2.5">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums text-white"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-neutral-900">{entry.ruleText}</p>
              </div>
            )}
            {(entry.doExamples.length > 0 || entry.dontExamples.length > 0) && (
              <div className={`grid gap-2 ${entry.doExamples.length > 0 && entry.dontExamples.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {entry.doExamples.length > 0 && (
                  <div className="rounded-lg border border-jade-100 bg-jade-100 px-3 py-2">
                    <Badge color="green">Do ✓</Badge>
                    <div className="mt-1.5 space-y-1">
                      {(entry.doExamples as (ExampleItem | string)[]).map(renderExampleItem)}
                    </div>
                  </div>
                )}
                {entry.dontExamples.length > 0 && (
                  <div className="rounded-lg border border-crimson-100 bg-crimson-100 px-3 py-2">
                    <Badge color="red">Don&apos;t ✗</Badge>
                    <div className="mt-1.5 space-y-1">
                      {(entry.dontExamples as (ExampleItem | string)[]).map(renderExampleItem)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </RuleCardShell>
  )
}

function MechanicsRuleCard({ rule }: { rule: MechanicsRule }) {
  if (!rule.data) return <LegacyRuleCard rule={rule} />
  if (rule.data.kind === 'capitalization') return <CapitalizationCard rule={rule} />
  return <RepeaterCard rule={rule} />
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MechanicsPage() {
  const vis = await getSectionVisibility()

  if (!vis.mechanics) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold text-neutral-900">Mechanics</h1>
          <p className="text-neutral-600">The technical rules that keep our writing polished across every channel.</p>
        </div>
        <div className="rounded-xl border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-base font-semibold text-neutral-200">Coming soon</p>
          <p className="mt-1 text-sm text-neutral-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

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

  const categoriesPresent = Array.from(
    new Set(sorted.map((r) => r.category).filter((c): c is string => Boolean(c)))
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-neutral-900">Mechanics</h1>
        <p className="text-neutral-600">The technical rules that keep our writing polished across every channel.</p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-neutral-600">No mechanics rules published yet.</p>
        </div>
      ) : (
        <div className="flex items-start gap-10">
          {categoriesPresent.length > 1 && (
            <aside className="sticky top-24 hidden w-44 shrink-0 md:block">
              <nav className="flex flex-col gap-1 border-l border-neutral-200 pl-4">
                {categoriesPresent.map((c) => (
                  <a
                    key={c}
                    href={`#${slugify(c)}`}
                    className="flex items-center gap-2 py-1 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: getAccent(c) }} />
                    {c}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {sorted.map((r, i) => {
              const prevCategory = i > 0 ? sorted[i - 1].category : null
              const showHeading = r.category && r.category !== prevCategory
              const categoryCount = showHeading ? sorted.filter((x) => x.category === r.category).length : 0
              return (
                <div key={r.id}>
                  {showHeading && (
                    <h2
                      id={slugify(r.category!)}
                      className={`${i > 0 ? 'mt-12' : ''} mb-3 flex scroll-mt-24 items-center gap-2 border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-900`}
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: getAccent(r.category) }} />
                      {r.category}
                      <span className="text-sm font-normal text-neutral-400">
                        · {categoryCount} {categoryCount === 1 ? 'rule' : 'rules'}
                      </span>
                    </h2>
                  )}
                  <MechanicsRuleCard rule={r as MechanicsRule} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
