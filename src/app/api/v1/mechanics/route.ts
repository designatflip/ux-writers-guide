import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'

export const dynamic = 'force-dynamic'

export async function GET() {
  const vis = await getSectionVisibility()
  if (!vis.mechanics) return apiError(404, 'not_found')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('mechanics_rules')
    .select('id, rule, category, example, dont_example, description, order_index, data, updated_at')
    .order('order_index', { ascending: true })

  if (error) return apiError(500, 'internal_error')

  return apiJson(data)
}
