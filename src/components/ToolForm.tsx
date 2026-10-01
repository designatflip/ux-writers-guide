'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toolStore } from '@/lib/store'
import { slugify } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { Tool, ToolLinkType } from '@/types'

interface ToolFormProps {
  tool?: Tool
}

export default function ToolForm({ tool }: ToolFormProps) {
  const router = useRouter()
  const isEditing = !!tool

  const [name, setName] = useState(tool?.name ?? '')
  const [slug, setSlug] = useState(tool?.slug ?? '')
  const [type, setType] = useState(tool?.type ?? '')
  const [description, setDescription] = useState(tool?.description ?? '')
  const [content, setContent] = useState(tool?.content ?? '')
  const [imageUrl, setImageUrl] = useState(tool?.image_url ?? '')
  const [linkType, setLinkType] = useState<ToolLinkType>(tool?.link_type ?? 'url')
  const [url, setUrl] = useState(tool?.url ?? '')
  const [instructions, setInstructions] = useState(tool?.instructions ?? '')
  const [orderIndex, setOrderIndex] = useState(String(tool?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleNameChange(val: string) {
    setName(val)
    if (!isEditing) setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        name,
        slug: slug || null,
        type,
        description,
        content: content || null,
        image_url: imageUrl || null,
        link_type: linkType,
        url: linkType === 'instructions' ? null : (url || null),
        instructions: linkType === 'instructions' ? (instructions || null) : null,
        order_index: parseInt(orderIndex) || 0,
        created_by: null,
      }
      if (isEditing) {
        await toolStore.update(tool.id, payload)
      } else {
        await toolStore.create(payload)
      }
      router.push('/entries/tools')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!tool || !confirm(`Delete "${tool.name}"? This cannot be undone.`)) return
    setLoading(true)
    try {
      await toolStore.delete(tool.id)
      router.push('/entries/tools')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-xl space-y-4">
      <Input
        label="Name"
        placeholder="e.g. Flip UX Writing Assistant"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        required
      />

      <Input
        label="Slug"
        placeholder="flip-ux-writing-assistant"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />

      <Input
        label="Type"
        placeholder="e.g. Figma Plugin, Claude Skill, Custom GPT, Localization Tool"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />

      <Textarea
        label="Description"
        placeholder="One line explaining what this tool does"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <Input
          label="Preview image URL (optional)"
          placeholder="https://… or /tool-previews/example.png"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <p className="text-xs text-neutral-400">Shown as a small square thumbnail next to this tool&apos;s title on the public Tools page. A tightly-cropped screenshot works best — this is cropped to a square, so a busy or wide screenshot may not frame well.</p>
        {imageUrl && (
          <div className="relative mt-1 h-24 w-24 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
              onLoad={(e) => { e.currentTarget.style.display = 'block' }}
            />
          </div>
        )}
      </div>

      <Textarea
        label="Details (optional)"
        placeholder="What this tool is and how to use it. Supports markdown — shown on this tool's own page."
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-900">How people access it</label>
        <select
          value={linkType}
          onChange={(e) => setLinkType(e.target.value as ToolLinkType)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-flip-orange focus:outline-none focus:ring-2 focus:ring-flip-orange/20"
        >
          <option value="url">Link (opens in a new tab)</option>
          <option value="download">Download (a file hosted on this site)</option>
          <option value="instructions">Instructions only (no link yet)</option>
        </select>
      </div>

      {linkType !== 'instructions' ? (
        <Input
          label={linkType === 'download' ? 'File path (e.g. /downloads/tool.zip)' : 'URL'}
          placeholder={linkType === 'download' ? '/downloads/flip-ux-writing-skill.zip' : 'https://…'}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      ) : (
        <Textarea
          label="Instructions"
          placeholder="e.g. Ask the design systems team for access"
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      )}

      <Input
        label="Order index"
        type="number"
        min={0}
        value={orderIndex}
        onChange={(e) => setOrderIndex(e.target.value)}
      />

      {error && <p className="text-sm text-crimson">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save changes' : 'Create tool'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        {isEditing && (
          <Button type="button" variant="ghost-danger" className="ml-auto" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
