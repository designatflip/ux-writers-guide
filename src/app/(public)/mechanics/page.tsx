import { createClient } from '@/lib/supabase/server'
import { MECHANICS_CATEGORIES } from '@/lib/mechanics-categories'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Mechanics — UX Writers Guide' }

export default async function MechanicsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('mechanics_rules')
    .select('*')
    .order('order_index', { ascending: true })

  const rules = data ?? []

  // Sort so known categories appear in order, unknown/null at the end
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
                  <h2 className={`${i > 0 ? 'mt-8' : ''} mb-3 text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2`}>
                    {r.category}
                  </h2>
                )}
                <div
                  className="rounded-xl border border-indigo-100 p-5 transition-all hover:border-indigo-200 hover:shadow-sm"
                  style={{ backgroundColor: '#f5f3ff' }}
                >
                  <p className="mb-3 text-sm font-semibold text-slate-800">{r.rule}</p>
                  {(r.example || r.dont_example) && (
                    <div className={`grid gap-2 ${r.example && r.dont_example ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {r.example && (
                        <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-2">
                          <p className="mb-1 text-xs font-medium text-green-600">Do this ✓</p>
                          <p className="font-mono text-sm text-slate-700">{r.example}</p>
                        </div>
                      )}
                      {r.dont_example && (
                        <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                          <p className="mb-1 text-xs font-medium text-red-500">Don't do this ✗</p>
                          <p className="font-mono text-sm text-slate-700">{r.dont_example}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {r.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{r.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
