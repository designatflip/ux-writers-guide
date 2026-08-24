import { createClient } from '@/lib/supabase/server'

export interface SearchData {
  terms: { id: string; term: string; term_bahasa: string | null }[]
  guidelines: { id: string; title: string; slug: string }[]
  rules: { id: string; rule: string; category: string | null }[]
  pillars: { id: string; title: string; productSlug: string }[]
  products: { id: string; name: string; slug: string }[]
}

export async function getSearchData(): Promise<SearchData> {
  const supabase = await createClient()

  const [{ data: terms }, { data: guidelines }, { data: pillars }, { data: mechRules }, { data: products }] =
    await Promise.all([
      supabase.from('glossary_terms').select('id, term, term_bahasa').order('term'),
      supabase.from('guidelines').select('id, title, slug').order('order_index'),
      supabase.from('tone_pillars').select('id, title, product_id').order('order_index'),
      supabase.from('mechanics_rules').select('id, rule, category').order('order_index'),
      supabase.from('products').select('id, name, slug').order('order_index'),
    ])

  const productList = products ?? []
  const productSlugById = new Map(productList.map((p) => [p.id, p.slug]))
  const pillarList = (pillars ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    productSlug: productSlugById.get(p.product_id) ?? '',
  }))

  return {
    terms: terms ?? [],
    guidelines: guidelines ?? [],
    rules: mechRules ?? [],
    pillars: pillarList,
    products: productList,
  }
}
