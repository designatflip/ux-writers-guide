'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { guidelineStore } from '@/lib/store'
import { slugify } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import type { Guideline } from '@/types'

interface GuidelineFormProps {
  guideline?: Guideline
}

type FormatType = 'bold' | 'italic' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'hr' | 'link'

export default function GuidelineForm({ guideline }: GuidelineFormProps) {
  const router = useRouter()
  const isEditing = !!guideline
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle] = useState(guideline?.title ?? '')
  const [slug, setSlug] = useState(guideline?.slug ?? '')
  const [content, setContent] = useState(guideline?.content ?? '')
  const [orderIndex, setOrderIndex] = useState(String(guideline?.order_index ?? 0))
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEditing) setSlug(slugify(val))
  }

  function applyFormat(type: FormatType) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const val = el.value
    const selected = val.slice(start, end)
    const lineStart = val.lastIndexOf('\n', start - 1) + 1

    let newVal = val
    let newStart = start
    let newEnd = end

    switch (type) {
      case 'bold': {
        const placeholder = selected || 'bold text'
        newVal = val.slice(0, start) + `**${placeholder}**` + val.slice(end)
        newStart = start + 2
        newEnd = newStart + placeholder.length
        break
      }
      case 'italic': {
        const placeholder = selected || 'italic text'
        newVal = val.slice(0, start) + `*${placeholder}*` + val.slice(end)
        newStart = start + 1
        newEnd = newStart + placeholder.length
        break
      }
      case 'code': {
        const placeholder = selected || 'code'
        newVal = val.slice(0, start) + '`' + placeholder + '`' + val.slice(end)
        newStart = start + 1
        newEnd = newStart + placeholder.length
        break
      }
      case 'h1':
      case 'h2':
      case 'h3': {
        const prefix = type === 'h1' ? '# ' : type === 'h2' ? '## ' : '### '
        newVal = val.slice(0, lineStart) + prefix + val.slice(lineStart)
        newStart = start + prefix.length
        newEnd = end + prefix.length
        break
      }
      case 'ul': {
        newVal = val.slice(0, lineStart) + '- ' + val.slice(lineStart)
        newStart = start + 2
        newEnd = end + 2
        break
      }
      case 'ol': {
        newVal = val.slice(0, lineStart) + '1. ' + val.slice(lineStart)
        newStart = start + 3
        newEnd = end + 3
        break
      }
      case 'quote': {
        newVal = val.slice(0, lineStart) + '> ' + val.slice(lineStart)
        newStart = start + 2
        newEnd = end + 2
        break
      }
      case 'hr': {
        const insert = '\n\n---\n\n'
        newVal = val.slice(0, start) + insert + val.slice(end)
        newStart = start + insert.length
        newEnd = newStart
        break
      }
      case 'link': {
        const linkText = selected || 'link text'
        newVal = val.slice(0, start) + `[${linkText}](url)` + val.slice(end)
        newStart = start + linkText.length + 3
        newEnd = newStart + 3
        break
      }
    }

    setContent(newVal)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(newStart, newEnd)
    })
  }

  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setConverting(true)
    try {
      const buffer = await file.arrayBuffer()
      const mammoth = (await import('mammoth')).default
      const TurndownService = (await import('turndown')).default
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer })
      const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' })
      setContent(td.turndown(html))
      if (!title) {
        const name = file.name.replace(/\.docx$/i, '')
        handleTitleChange(name)
      }
    } catch {
      setError('Failed to convert document. Make sure it is a valid .docx file.')
    } finally {
      setConverting(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      title,
      slug,
      content: content || null,
      order_index: parseInt(orderIndex) || 0,
      created_by: null,
    }

    try {
      if (isEditing) {
        await guidelineStore.update(guideline.id, payload)
      } else {
        await guidelineStore.create(payload)
      }
      router.push('/entries/guidelines')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!guideline || !confirm('Delete this guideline? This cannot be undone.')) return
    setLoading(true)
    try {
      await guidelineStore.delete(guideline.id)
      router.push('/entries/guidelines')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="max-w-2xl space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Writing for errors"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        required
      />
      <Input
        label="Slug"
        placeholder="writing-for-errors"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />
      <Input
        label="Order index"
        type="number"
        min={0}
        value={orderIndex}
        onChange={(e) => setOrderIndex(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Content</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={converting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
          >
            {converting ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Converting…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload .docx
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleDocUpload}
          />
        </div>

        {/* Formatting toolbar */}
        <div className="flex flex-wrap items-center gap-px rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 px-2 py-1.5">
          {/* Headings */}
          <ToolbarBtn onClick={() => applyFormat('h1')} title="Heading 1">H1</ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('h2')} title="Heading 2">H2</ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('h3')} title="Heading 3">H3</ToolbarBtn>
          <ToolbarDivider />
          {/* Inline */}
          <ToolbarBtn onClick={() => applyFormat('bold')} title="Bold">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('italic')} title="Italic">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('code')} title="Inline code">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </ToolbarBtn>
          <ToolbarDivider />
          {/* Lists */}
          <ToolbarBtn onClick={() => applyFormat('ul')} title="Bullet list">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('ol')} title="Numbered list">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 10h2" stroke="currentColor" strokeWidth="1.8"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke="currentColor" strokeWidth="1.8"/></svg>
          </ToolbarBtn>
          <ToolbarDivider />
          {/* Quote, HR, Link */}
          <ToolbarBtn onClick={() => applyFormat('quote')} title="Blockquote">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('hr')} title="Horizontal rule">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('link')} title="Link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </ToolbarBtn>
        </div>

        <Textarea
          ref={textareaRef}
          placeholder="Write the guideline content here, or upload a .docx file above…"
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded-t-none border-t-0 focus:border-slate-200 focus:ring-0"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save changes' : 'Create guideline'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        {isEditing && (
          <Button type="button" variant="danger" className="ml-auto" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}

function ToolbarBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-1 h-4 w-px bg-slate-300" />
}
