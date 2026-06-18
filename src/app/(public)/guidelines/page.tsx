import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function GuidelinesPage() {
  const supabase = await createClient()
  const { data: guidelines } = await supabase
    .from('guidelines')
    .select('id, title, slug, order_index')
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Guidelines</h1>
        <p className="text-slate-500">Writing principles and conventions for our products.</p>
      </div>

      {!guidelines || guidelines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <p className="text-slate-500">No guidelines published yet.</p>
        </div>
      ) : (
        <ol className="space-y-2">
          {guidelines.map((g, i) => (
            <li key={g.id}>
              <Link
                href={`/guidelines/${g.slug}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-all hover:border-indigo-200 hover:shadow-sm"
              >
                <span className="w-7 text-lg font-bold tabular-nums text-indigo-600">{i + 1}.</span>
                <span className="text-base font-medium text-slate-900">{g.title}</span>
                <span className="ml-auto text-slate-400">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
