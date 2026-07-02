export type GlossaryTerm = {
  id: string
  term: string
  term_bahasa: string | null
  definition: string
  avoid: string[] | null
  category: string | null
  tags: string[] | null
  status: 'draft' | 'published'
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Guideline = {
  id: string
  title: string
  slug: string
  content: string | null
  order_index: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type TonePillar = {
  id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export type RuleEntry = {
  ruleText: string
  doExamples: string[]
  dontExamples: string[]
}

export type CapitalizationData = {
  kind: 'capitalization'
  textComponents: string[]
  uiComponents: string[]
}

export type RepeaterData = {
  kind: 'repeater'
  rules: RuleEntry[]
}

export type MechanicsRuleData = CapitalizationData | RepeaterData

export type MechanicsRule = {
  id: string
  rule: string
  category: string | null
  example: string | null
  dont_example: string | null
  description: string | null
  order_index: number
  data: MechanicsRuleData | null
  created_at: string
  updated_at: string
}

export type UserRole = 'editor' | 'viewer'
