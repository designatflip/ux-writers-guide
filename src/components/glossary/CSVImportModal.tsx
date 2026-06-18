'use client'

import { useRef, useState } from 'react'
import { termStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface ParsedRow {
  term: string
  term_bahasa: string
  definition: string
  avoid: string
  category: string
  tags: string
  status: 'draft' | 'published'
  error?: string
}

interface CSVImportModalProps {
  onClose: () => void
  onImported: () => void
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase())

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    const get = (key: string) => values[headers.indexOf(key)] ?? ''

    const term = get('term')
    const definition = get('definition')
    const rawStatus = get('status').toLowerCase()
    const status: 'draft' | 'published' =
      rawStatus === 'published' ? 'published' : 'draft'

    return {
      term,
      term_bahasa: get('term_bahasa'),
      definition,
      avoid: get('avoid'),
      category: get('category'),
      tags: get('tags'),
      status,
      error: !term ? 'Missing term' : !definition ? 'Missing definition' : undefined,
    }
  })
}

export default function CSVImportModal({ onClose, onImported }: CSVImportModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [imported, setImported] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setRows(parseCSV(text))
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    const valid = rows.filter((r) => !r.error)
    await Promise.all(
      valid.map((r) =>
        termStore.create({
          term: r.term,
          term_bahasa: r.term_bahasa || null,
          definition: r.definition,
          avoid: r.avoid ? r.avoid.split(',').map((t) => t.trim()).filter(Boolean) : null,
          category: r.category || null,
          tags: r.tags ? r.tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
          status: r.status,
          created_by: null,
        })
      )
    )
    setImported(true)
    onImported()
  }

  const validCount = rows.filter((r) => !r.error).length
  const errorCount = rows.filter((r) => !!r.error).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Import from CSV</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Required: <code className="font-mono">term</code>, <code className="font-mono">definition</code>
              {' '}· Optional: <code className="font-mono">term_bahasa</code>, <code className="font-mono">avoid</code>, <code className="font-mono">category</code>, <code className="font-mono">tags</code>, <code className="font-mono">status</code>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {/* File picker */}
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-2xl">📂</span>
            <p className="text-sm font-medium text-slate-700">
              {fileName || 'Click to choose a CSV file'}
            </p>
            {fileName && <p className="text-xs text-slate-400">Click to choose a different file</p>}
            <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </div>

          {/* Preview */}
          {rows.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700">{rows.length} rows found</span>
                {validCount > 0 && <Badge color="green">{validCount} valid</Badge>}
                {errorCount > 0 && <Badge color="red">{errorCount} errors</Badge>}
              </div>
              <div className="overflow-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-3 py-2 font-medium text-slate-600">Term (EN)</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Term (ID)</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Definition</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Avoid</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-slate-100 last:border-0 ${row.error ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-3 py-2 font-medium text-slate-900 max-w-[130px] truncate">
                          {row.error ? (
                            <span className="text-red-600 italic">{row.error}</span>
                          ) : row.term}
                        </td>
                        <td className="px-3 py-2 text-slate-500 max-w-[120px] truncate">{row.term_bahasa || '—'}</td>
                        <td className="px-3 py-2 text-slate-600 max-w-[200px] truncate">{row.definition}</td>
                        <td className="px-3 py-2 text-slate-500 max-w-[120px] truncate">{row.avoid || '—'}</td>
                        <td className="px-3 py-2">
                          <Badge color={row.status === 'published' ? 'green' : 'amber'}>{row.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {imported && (
            <p className="text-sm font-medium text-green-700">
              ✓ {validCount} {validCount === 1 ? 'entry' : 'entries'} imported successfully.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <a
            href="data:text/csv;charset=utf-8,term,term_bahasa,definition,avoid,category,tags,status%0AError%20state,Status%20kesalahan,%22UI%20text%20shown%20when%20something%20goes%20wrong%22,%22failure%2Cbroke%22,UI%20Patterns,%22errors%2Cforms%22,published"
            download="uxw-template.csv"
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Download template
          </a>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              {imported ? 'Close' : 'Cancel'}
            </Button>
            {!imported && (
              <Button onClick={handleImport} disabled={validCount === 0}>
                Import {validCount > 0 ? `${validCount} entries` : ''}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
