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
        <h1 className="text-3xl font-bold text-neutral-900">Tone of Voice</h1>
      </div>

      <div className="mb-10">
        <p className="mb-6 text-neutral-700">
          Flip has always had a brand voice since we first appeared in 2016: Fair, Smart, and Friendly.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-flip-orange">Friendly</h2>
            <p className="text-neutral-700">
              Communicate like a good friend, not stranger. We need to{' '}
              <strong className="font-bold text-neutral-900">understand each customer is different with their own challenges and passions.</strong>{' '}
              We also give them feelings of <strong className="font-bold text-neutral-900">familiar, warm, and calm.</strong>
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-3xl font-bold text-flip-orange">Fair</h2>
            <p className="text-neutral-700">
              Fairness is Flip&apos;s inherent main vision. Before we communicate to the audience, we need to think: is it fair to our user?
              Give them senses of <strong className="font-bold text-neutral-900">clarity, transparency, and getting immediate response.</strong>
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-3xl font-bold text-flip-orange">Smart</h2>
            <p className="text-neutral-700">
              We all know that one friend who experience and compassionate at the same time, right? Flip communicate like this.
              We want to educate people with new perspective without patronizing or confusing them.{' '}
              <strong className="font-bold text-neutral-900">Give them a sense that Flip is their bridge from them to new knowledge.</strong>
            </p>
          </div>
        </div>

        <p className="mt-8 text-neutral-700">
          However, today, Flip has a variety of products catering to very different users. We&apos;ve mapped our tone of voice for each product below.
        </p>
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
