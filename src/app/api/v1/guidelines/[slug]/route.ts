import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const vis = await getSectionVisibility()
  if (!vis.guidelines) return apiError(404, 'not_found')

  const { slug } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('guidelines')
    .select('id, title, slug, content, order_index, updated_at')
    .eq('slug', slug)
    .single()

  if (error || !data) return apiError(404, 'not_found')

  return apiJson(data)
}
