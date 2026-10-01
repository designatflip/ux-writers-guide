'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toolStore } from '@/lib/store'
import ToolForm from '@/components/ToolForm'
import type { Tool } from '@/types'

export default function EditToolPage() {
  const { id } = useParams<{ id: string }>()
  const [tool, setTool] = useState<Tool | null>(null)

  useEffect(() => {
    toolStore.list().then((tools) => {
      setTool(tools.find((t) => t.id === id) ?? null)
    })
  }, [id])

  if (!tool) return <p className="text-neutral-600">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit Tool</h1>
      <ToolForm tool={tool} />
    </div>
  )
}
