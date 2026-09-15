import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'
import { getGuidelineBySlug } from '@/lib/api/queries'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const vis = await getSectionVisibility()
  if (!vis.guidelines) return apiError(404, 'not_found')

  const { slug } = await params
  const supabase = await createClient()
  const { data, error } = await getGuidelineBySlug(supabase, slug)

  if (error || !data) return apiError(404, 'not_found')

  return apiJson(data)
}
