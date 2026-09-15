import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export async function getGlossaryTerms(supabase: SupabaseClient) {
  return supabase
    .from('glossary_terms')
    .select('id, term, term_bahasa, definition, avoid, category, tags, updated_at')
    .eq('status', 'published')
    .order('term_bahasa', { ascending: true, nullsFirst: false })
    .order('term', { ascending: true })
}

export async function getMechanicsRules(supabase: SupabaseClient) {
  return supabase
    .from('mechanics_rules')
    .select('id, rule, category, example, dont_example, description, order_index, data, updated_at')
    .order('order_index', { ascending: true })
}

export async function getGuidelinesList(supabase: SupabaseClient) {
  return supabase
    .from('guidelines')
    .select('id, title, slug, order_index')
    .order('order_index', { ascending: true })
}

export async function getAllGuidelinesFull(supabase: SupabaseClient) {
  return supabase
    .from('guidelines')
    .select('id, title, slug, content, order_index, updated_at')
    .order('order_index', { ascending: true })
}

export async function getGuidelineBySlug(supabase: SupabaseClient, slug: string) {
  return supabase
    .from('guidelines')
    .select('id, title, slug, content, order_index, updated_at')
    .eq('slug', slug)
    .single()
}

export async function getProductsList(supabase: SupabaseClient) {
  return supabase
    .from('products')
    .select('id, name, slug, order_index')
    .order('order_index', { ascending: true })
}

async function getProductTone(supabase: SupabaseClient, productId: string) {
  const [{ data: brandConstants, error: bcError }, { data: tonePillars, error: tpError }] = await Promise.all([
    supabase
      .from('brand_constants')
      .select('id, constant, heading, description, order_index')
      .eq('product_id', productId)
      .order('order_index', { ascending: true }),
    supabase
      .from('tone_pillars')
      .select('id, title, description, do_example, dont_example, order_index')
      .eq('product_id', productId)
      .order('order_index', { ascending: true }),
  ])

  return { brandConstants, tonePillars, error: bcError ?? tpError ?? null }
}

export async function getProductToneBySlug(supabase: SupabaseClient, slug: string) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, slug, description, features, order_index, updated_at')
    .eq('slug', slug)
    .single()

  if (productError || !product) return { product: null, brandConstants: null, tonePillars: null, error: productError }

  const { brandConstants, tonePillars, error } = await getProductTone(supabase, product.id)
  return { product, brandConstants, tonePillars, error }
}

export async function getAllProductsWithTone(supabase: SupabaseClient) {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, slug, description, features, order_index, updated_at')
    .order('order_index', { ascending: true })

  if (productsError || !products) return { data: null, error: productsError }

  const results = await Promise.all(
    products.map(async (product) => {
      const { brandConstants, tonePillars, error } = await getProductTone(supabase, product.id)
      return { product, brandConstants, tonePillars, error }
    })
  )

  const firstError = results.find((r) => r.error)?.error ?? null
  if (firstError) return { data: null, error: firstError }

  return {
    data: results.map(({ product, brandConstants, tonePillars }) => ({ product, brandConstants, tonePillars })),
    error: null,
  }
}
