import { createClient } from '@/lib/supabase/server'

export type SectionVisibility = {
  glossary: boolean
  guidelines: boolean
  mechanics: boolean
  tone: boolean
}

export async function getSectionVisibility(): Promise<SectionVisibility> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'section_visibility')
    .single()
  const raw = (data?.value as Partial<SectionVisibility>) ?? {}
  return {
    glossary:   raw.glossary   !== false,
    guidelines: raw.guidelines !== false,
    mechanics:  raw.mechanics  !== false,
    tone:       raw.tone       !== false,
  }
}
