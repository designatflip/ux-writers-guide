import { createClient } from '@/lib/supabase/client'
import type { GlossaryTerm, Guideline, TonePillar, MechanicsRule } from '@/types'

export const termStore = {
  async list(): Promise<GlossaryTerm[]> {
    const supabase = createClient()
    const { data } = await supabase
      .from('glossary_terms')
      .select('*')
      .order('updated_at', { ascending: false })
    return data ?? []
  },

  async create(data: Omit<GlossaryTerm, 'id' | 'created_at' | 'updated_at'>): Promise<GlossaryTerm> {
    const supabase = createClient()
    const { data: created, error } = await supabase
      .from('glossary_terms')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return created
  },

  async update(id: string, data: Partial<GlossaryTerm>): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('glossary_terms')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('glossary_terms')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}

export const guidelineStore = {
  async list(): Promise<Guideline[]> {
    const supabase = createClient()
    const { data } = await supabase
      .from('guidelines')
      .select('*')
      .order('order_index', { ascending: true })
    return data ?? []
  },

  async create(data: Omit<Guideline, 'id' | 'created_at' | 'updated_at'>): Promise<Guideline> {
    const supabase = createClient()
    const { data: created, error } = await supabase
      .from('guidelines')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return created
  },

  async update(id: string, data: Partial<Guideline>): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('guidelines')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('guidelines')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}

export const tonePillarStore = {
  async list(): Promise<TonePillar[]> {
    const supabase = createClient()
    const { data } = await supabase
      .from('tone_pillars')
      .select('*')
      .order('order_index', { ascending: true })
    return data ?? []
  },

  async create(data: Omit<TonePillar, 'id' | 'created_at' | 'updated_at'>): Promise<TonePillar> {
    const supabase = createClient()
    const { data: created, error } = await supabase
      .from('tone_pillars')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return created
  },

  async update(id: string, data: Partial<TonePillar>): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('tone_pillars')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('tone_pillars')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}

export const mechanicsRuleStore = {
  async list(): Promise<MechanicsRule[]> {
    const supabase = createClient()
    const { data } = await supabase
      .from('mechanics_rules')
      .select('*')
      .order('order_index', { ascending: true })
    return data ?? []
  },

  async create(data: Omit<MechanicsRule, 'id' | 'created_at' | 'updated_at'>): Promise<MechanicsRule> {
    const supabase = createClient()
    const { data: created, error } = await supabase
      .from('mechanics_rules')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return created
  },

  async update(id: string, data: Partial<MechanicsRule>): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('mechanics_rules')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('mechanics_rules')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
