import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import type { BrandConstant, TonePillar } from '@/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tone of Voice — Flip Communication Hub' }

const HEADER_BG = '#d1f2df'

function BrandConstantsTable({ constants }: { constants: BrandConstant[] }) {
  if (constants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
        <p className="text-slate-500">No brand constants published yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: HEADER_BG }}>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">Brand Constants</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">Manifestation in Flip Core</th>
          </tr>
        </thead>
        <tbody>
          {constants.map((c) => (
            <tr key={c.id} className="border-t border-slate-200">
              <td className="px-4 py-3 align-top font-medium text-slate-800">{c.constant}</td>
              <td className="px-4 py-3 align-top">
                <p className="font-bold text-slate-900">{c.heading}</p>
                {c.description && <p className="mt-1 text-slate-600">{c.description}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TonePillarsTable({ pillars }: { pillars: TonePillar[] }) {
  if (pillars.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
        <p className="text-slate-500">No tone pillars published yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: HEADER_BG }}>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">Pillar</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">Do&apos;s</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-800">Don&apos;ts</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((p) => (
            <tr key={p.id} className="border-t border-slate-200">
              <td className="px-4 py-3 align-top font-medium text-slate-800">{p.title}</td>
              <td className="px-4 py-3 align-top text-slate-600">{p.description ?? '—'}</td>
              <td className="px-4 py-3 align-top text-slate-700">{p.do_example ? `"${p.do_example}"` : '—'}</td>
              <td className="px-4 py-3 align-top text-slate-700">{p.dont_example ? `"${p.dont_example}"` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

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
  const [{ data: constantsData }, { data: pillarsData }] = await Promise.all([
    supabase.from('brand_constants').select('*').order('order_index', { ascending: true }),
    supabase.from('tone_pillars').select('*').order('order_index', { ascending: true }),
  ])

  const constants = constantsData ?? []
  const pillars = pillarsData ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Tone of Voice</h1>
        <p className="text-slate-500">Our personality on the page — how we sound in everything we write.</p>
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Brand Constants</h2>
        <BrandConstantsTable constants={constants} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Flip Core Tone of Voice</h2>
        <TonePillarsTable pillars={pillars} />
      </div>
    </div>
  )
}
