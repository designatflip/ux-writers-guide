import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import Badge from '@/components/ui/Badge'
import type { BrandConstant, TonePillar } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name').eq('slug', slug).single()
  return { title: data?.name ? `${data.name} Tone of Voice — Flip Communication Hub` : 'Tone of Voice' }
}

const HEADER_BG = '#AAE1D9'

function BrandConstantsTable({ constants, productName }: { constants: BrandConstant[]; productName: string }) {
  if (constants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center">
        <p className="text-neutral-600">No brand constants published yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: HEADER_BG }}>
            <th className="px-4 py-3 text-left font-semibold text-neutral-900">Brand Constants</th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-900">Manifestation in {productName}</th>
          </tr>
        </thead>
        <tbody>
          {constants.map((c) => (
            <tr key={c.id} className="border-t border-neutral-200">
              <td className="px-4 py-3 align-top font-medium text-neutral-900">{c.constant}</td>
              <td className="px-4 py-3 align-top">
                <p className="font-bold text-neutral-900">{c.heading}</p>
                {c.description && <p className="mt-1 text-neutral-600">{c.description}</p>}
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
      <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center">
        <p className="text-neutral-600">No tone pillars published yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: HEADER_BG }}>
            <th className="px-4 py-3 text-left font-semibold text-neutral-900">Pillar</th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-900">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-900">Do&apos;s</th>
            <th className="px-4 py-3 text-left font-semibold text-neutral-900">Don&apos;ts</th>
          </tr>
        </thead>
        <tbody>
          {pillars.map((p) => (
            <tr key={p.id} className="border-t border-neutral-200">
              <td className="px-4 py-3 align-top font-medium text-neutral-900">{p.title}</td>
              <td className="px-4 py-3 align-top text-neutral-600">{p.description ?? '—'}</td>
              <td className="px-4 py-3 align-top text-neutral-900">{p.do_example ? `"${p.do_example}"` : '—'}</td>
              <td className="px-4 py-3 align-top text-neutral-900">{p.dont_example ? `"${p.dont_example}"` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function ProductTonePage({ params }: Props) {
  const { slug } = await params
  const [vis, supabase] = await Promise.all([getSectionVisibility(), createClient()])

  if (!vis.tone) {
    return (
      <div>
        <Link href="/tone" className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          ← Back to Tone of Voice
        </Link>
        <div className="mt-16 rounded-xl border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-base font-semibold text-neutral-200">Coming soon</p>
          <p className="mt-1 text-sm text-neutral-400">This section isn&apos;t published yet.</p>
        </div>
      </div>
    )
  }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  const [{ data: constantsData }, { data: pillarsData }] = await Promise.all([
    supabase.from('brand_constants').select('*').eq('product_id', product.id).order('order_index', { ascending: true }),
    supabase.from('tone_pillars').select('*').eq('product_id', product.id).order('order_index', { ascending: true }),
  ])

  const constants = constantsData ?? []
  const pillars = pillarsData ?? []

  return (
    <div>
      <Link href="/tone" className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to Tone of Voice
      </Link>
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-neutral-900">{product.name}</h1>
        <p className="text-neutral-600">
          {product.description || 'Our personality on the page — how we sound in everything we write.'}
        </p>
        {product.features && product.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.features.map((f: string) => (
              <Badge key={f} color="indigo">{f}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Brand Constants</h2>
        <BrandConstantsTable constants={constants} productName={product.name} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Tone of Voice</h2>
        <TonePillarsTable pillars={pillars} />
      </div>
    </div>
  )
}
