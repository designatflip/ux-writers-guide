import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'
import { getGlossaryTerms } from '@/lib/api/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const vis = await getSectionVisibility()
  if (!vis.glossary) return apiError(404, 'not_found')

  const supabase = await createClient()
  const { data, error } = await getGlossaryTerms(supabase)

  if (error) return apiError(500, 'internal_error')

  return apiJson(data)
}
