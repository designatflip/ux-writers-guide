import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'
import { getProductToneBySlug } from '@/lib/api/queries'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const vis = await getSectionVisibility()
  if (!vis.tone) return apiError(404, 'not_found')

  const { slug } = await params
  const supabase = await createClient()
  const { product, brandConstants, tonePillars, error } = await getProductToneBySlug(supabase, slug)

  if (error || !product) return apiError(404, 'not_found')

  return apiJson({ product, brandConstants, tonePillars })
}
