'use client'

import { useRef, useState } from 'react'
import { mechanicsRuleStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface ParsedRow {
  category: string
  rule: string
  example: string
  dont_example: string
  description: string
  order_index: number
  error?: string
}

interface MechanicsCSVImportModalProps {
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

    const rule = get('rule')
    const order_index = parseInt(get('order_index')) || 0

    return {
      category: get('category'),
      rule,
      example: get('example'),
      dont_example: get('dont_example'),
      description: get('description'),
      order_index,
      error: !rule ? 'Missing rule' : undefined,
    }
  })
}

export default function MechanicsCSVImportModal({ onClose, onImported }: MechanicsCSVImportModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [imported, setImported] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setRows(parseCSV(ev.target?.result as string))
    reader.readAsText(file)
  }

  async function handleImport() {
    await Promise.all(
      rows.filter((r) => !r.error).map((r) =>
        mechanicsRuleStore.create({
          category: r.category || null,
          rule: r.rule,
          example: r.example || null,
          dont_example: r.dont_example || null,
          description: r.description || null,
          order_index: r.order_index,
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
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Import Mechanics Rules from CSV</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Required: <code className="font-mono">rule</code>
              {' '}· Optional: <code className="font-mono">category</code>, <code className="font-mono">example</code>, <code className="font-mono">dont_example</code>, <code className="font-mono">description</code>, <code className="font-mono">order_index</code>
            </p>
          </div>
          <button onClick={onClose} className="text-xl leading-none text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-auto px-6 py-5">
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-2xl">📂</span>
            <p className="text-sm font-medium text-slate-700">
              {fileName || 'Click to choose a CSV file'}
            </p>
            {fileName && <p className="text-xs text-slate-400">Click to choose a different file</p>}
            <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </div>

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
                      <th className="px-3 py-2 font-medium text-slate-600">Category</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Rule</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Do ✓</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Don't ✗</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className={`border-b border-slate-100 last:border-0 ${row.error ? 'bg-red-50' : ''}`}>
                        <td className="max-w-[120px] truncate px-3 py-2 text-slate-500">{row.category || '—'}</td>
                        <td className="max-w-[160px] truncate px-3 py-2 font-medium text-slate-900">
                          {row.error
                            ? <span className="italic text-red-600">{row.error}</span>
                            : row.rule}
                        </td>
                        <td className="max-w-[120px] truncate px-3 py-2 font-mono text-slate-500">{row.example || '—'}</td>
                        <td className="max-w-[120px] truncate px-3 py-2 font-mono text-slate-500">{row.dont_example || '—'}</td>
                        <td className="px-3 py-2 text-slate-500">{row.order_index}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {imported && (
            <p className="text-sm font-medium text-green-700">
              ✓ {validCount} {validCount === 1 ? 'rule' : 'rules'} imported successfully.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <a
            href="data:text/csv;charset=utf-8,category,rule,example,dont_example,description,order_index%0APunctuation,Oxford%20comma,%22strategy%2C%20copy%2C%20and%20design%22,%22strategy%2C%20copy%20and%20design%22,%22Always%20use%20a%20serial%20comma%20before%20the%20final%20item%22,1"
            download="mechanics-template.csv"
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
                Import {validCount > 0 ? `${validCount} ${validCount === 1 ? 'rule' : 'rules'}` : ''}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
