import { createClient } from '@/lib/supabase/server'
import { getSectionVisibility } from '@/lib/site-settings'
import { apiJson, apiError } from '@/lib/api/response'
import { getGlossaryTerms, getMechanicsRules, getAllGuidelinesFull, getAllProductsWithTone } from '@/lib/api/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const vis = await getSectionVisibility()
  const supabase = await createClient()

  const [glossaryResult, guidelinesResult, mechanicsResult, toneResult] = await Promise.all([
    vis.glossary ? getGlossaryTerms(supabase) : Promise.resolve({ data: null, error: null }),
    vis.guidelines ? getAllGuidelinesFull(supabase) : Promise.resolve({ data: null, error: null }),
    vis.mechanics ? getMechanicsRules(supabase) : Promise.resolve({ data: null, error: null }),
    vis.tone ? getAllProductsWithTone(supabase) : Promise.resolve({ data: null, error: null }),
  ])

  if (glossaryResult.error || guidelinesResult.error || mechanicsResult.error || toneResult.error) {
    return apiError(500, 'internal_error')
  }

  return apiJson({
    glossary: glossaryResult.data,
    guidelines: guidelinesResult.data,
    mechanics: mechanicsResult.data,
    tone: toneResult.data,
  })
}
