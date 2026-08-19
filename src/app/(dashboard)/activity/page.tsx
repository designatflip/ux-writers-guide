import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'
import type { ActivityAction, ActivityLog } from '@/types'

export const dynamic = 'force-dynamic'

const actionColor: Record<ActivityAction, 'green' | 'indigo' | 'red'> = {
  create: 'green',
  update: 'indigo',
  delete: 'red',
}

const entityLabels: Record<string, string> = {
  glossary_terms: 'Glossary Term',
  guidelines: 'Guideline',
  products: 'Product',
  tone_pillars: 'Tone Pillar',
  brand_constants: 'Brand Constant',
  mechanics_rules: 'Mechanics Rule',
}

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as ActivityLog[]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Change Log</h1>
        <p className="text-sm text-slate-500">Who changed what, and when</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          <p className="text-slate-500">No changes recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Who</th>
                <th className="px-4 py-3 font-medium text-slate-600">Action</th>
                <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 font-medium text-slate-600">Item</th>
                <th className="px-4 py-3 font-medium text-slate-600">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{row.actor_email}</td>
                  <td className="px-4 py-3">
                    <Badge color={actionColor[row.action]}>{row.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{entityLabels[row.entity_type] ?? row.entity_type}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.entity_label}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
