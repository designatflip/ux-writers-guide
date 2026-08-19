import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tone of Voice — Flip Communication Hub' }

export default async function TonePage() {
  const [vis, supabase] = await Promise.all([
    getSectionVisibility(),
    createClient(),
  ])

  if (!vis.tone) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold text-neutral-900">Tone of Voice</h1>
          <p className="text-neutral-600">Our personality on the page — how we sound in everything we write.</p>
        </div>
        <div className="rounded-xl border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-base font-semibold text-neutral-200">Coming soon</p>
          <p className="mt-1 text-sm text-neutral-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, order_index')
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-neutral-900">Tone of Voice</h1>
        <p className="text-neutral-600">Our personality on the page — how we sound in everything we write, per product.</p>
      </div>

      {!products || products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-neutral-600">No products published yet.</p>
        </div>
      ) : (
        <ol className="space-y-2">
          {products.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/tone/${p.slug}`}
                className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 transition-all hover:border-flip-orange-200 hover:shadow-sm"
              >
                <span className="w-7 text-lg font-bold tabular-nums text-flip-orange">{i + 1}.</span>
                <span className="text-base font-medium text-neutral-900">{p.name}</span>
                <span className="ml-auto text-neutral-400">→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
