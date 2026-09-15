import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const vis = await getSectionVisibility()
  if (!vis.tone) return apiError(404, 'not_found')

  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, slug, description, features, order_index, updated_at')
    .eq('slug', slug)
    .single()

  if (productError || !product) return apiError(404, 'not_found')

  const [{ data: brandConstants, error: bcError }, { data: tonePillars, error: tpError }] = await Promise.all([
    supabase
      .from('brand_constants')
      .select('id, constant, heading, description, order_index')
      .eq('product_id', product.id)
      .order('order_index', { ascending: true }),
    supabase
      .from('tone_pillars')
      .select('id, title, description, do_example, dont_example, order_index')
      .eq('product_id', product.id)
      .order('order_index', { ascending: true }),
  ])

  if (bcError || tpError) return apiError(500, 'internal_error')

  return apiJson({ product, brandConstants, tonePillars })
}
