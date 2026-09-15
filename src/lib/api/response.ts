import { NextResponse } from 'next/server'

const API_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
}

export function apiJson<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    { data },
    { ...init, headers: { ...API_HEADERS, ...init?.headers } }
  )
}

export function apiError(status: number, message: string) {
  return NextResponse.json(
    { error: message },
    { status, headers: API_HEADERS }
  )
}
