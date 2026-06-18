import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('id, term, status')
    .limit(5)

  return NextResponse.json({
    env: {
      url_set: !!url,
      url_starts_with_http: url.startsWith('http'),
      url_prefix: url.slice(0, 35),
      key_set: !!key,
      key_length: key.length,
    },
    query: {
      data,
      error: error ? { message: error.message, code: error.code } : null,
      count: data?.length ?? 0,
    },
  })
}
