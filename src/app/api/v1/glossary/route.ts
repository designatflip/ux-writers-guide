import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'

export const dynamic = 'force-dynamic'

export async function GET() {
  const vis = await getSectionVisibility()
  if (!vis.glossary) return apiError(404, 'not_found')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('id, term, term_bahasa, definition, avoid, category, tags, updated_at')
    .eq('status', 'published')
    .order('term_bahasa', { ascending: true, nullsFirst: false })
    .order('term', { ascending: true })

  if (error) return apiError(500, 'internal_error')

  return apiJson(data)
}
