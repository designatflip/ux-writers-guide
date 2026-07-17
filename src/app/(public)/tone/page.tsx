import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tone of Voice — Flip Communication Hub' }

export default async function TonePage() {
  const vis = await getSectionVisibility()

  if (!vis.tone) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold text-slate-900">Tone of Voice</h1>
          <p className="text-slate-500">Our personality on the page — how we sound in everything we write.</p>
        </div>
        <div className="rounded-xl border border-dashed border-slate-200 py-24 text-center">
          <p className="text-base font-semibold text-slate-300">Coming soon</p>
          <p className="mt-1 text-sm text-slate-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('tone_pillars')
    .select('*')
    .order('order_index', { ascending: true })

  const pillars = data ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Tone of Voice</h1>
        <p className="text-slate-500">Our personality on the page — how we sound in everything we write.</p>
      </div>

      {pillars.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-slate-500">No tone pillars published yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-teal-100 p-5 transition-all hover:border-teal-200 hover:shadow-sm"
              style={{ backgroundColor: '#f0fdf9' }}
            >
              <h3 className="mb-2 text-base font-bold text-slate-900">{p.title}</h3>
              {p.description && (
                <p className="text-sm leading-relaxed text-slate-600">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
