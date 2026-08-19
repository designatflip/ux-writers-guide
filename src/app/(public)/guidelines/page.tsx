import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export default async function GuidelinesPage() {
  const [vis, supabase] = await Promise.all([
    getSectionVisibility(),
    createClient(),
  ])

  if (!vis.guidelines) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold text-neutral-900">Guidelines</h1>
          <p className="text-neutral-600">Writing principles and conventions for our products.</p>
        </div>
        <div className="rounded-xl border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-base font-semibold text-neutral-200">Coming soon</p>
          <p className="mt-1 text-sm text-neutral-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

  const { data: guidelines } = await supabase
    .from('guidelines')
    .select('id, title, slug, order_index')
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-neutral-900">Guidelines</h1>
        <p className="text-neutral-600">Writing principles and conventions for our products.</p>
      </div>

      {!guidelines || guidelines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-neutral-600">No guidelines published yet.</p>
        </div>
      ) : (
        <ol className="space-y-2">
          {guidelines.map((g, i) => (
            <li key={g.id}>
              <Link
                href={`/guidelines/${g.slug}`}
                className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 transition-all hover:border-flip-orange-200 hover:shadow-sm"
              >
                <span className="w-7 text-lg font-bold tabular-nums text-flip-orange">{i + 1}.</span>
                <span className="text-base font-medium text-neutral-900">{g.title}</span>
                <span className="ml-auto text-neutral-400">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
