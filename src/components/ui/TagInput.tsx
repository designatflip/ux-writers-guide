'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  label?: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

export default function TagInput({ label, items, onChange, placeholder = 'Type and press Enter…' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  function commitValue(raw: string) {
    const value = raw.trim().replace(/,$/, '').trim()
    if (!value || items.includes(value)) return
    onChange([...items, value])
    setInputValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitValue(inputValue)
    } else if (e.key === ',') {
      e.preventDefault()
      commitValue(inputValue)
    } else if (e.key === 'Backspace' && inputValue === '' && items.length > 0) {
      onChange(items.slice(0, -1))
    }
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-900">{label}</label>
      )}
      <div className="min-h-[42px] flex flex-wrap gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 focus-within:border-flip-orange-300 focus-within:ring-2 focus-within:ring-flip-orange-100">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-flip-orange-100 px-2.5 py-0.5 text-xs font-medium text-flip-orange-700"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-flip-orange-300 hover:bg-flip-orange-200 hover:text-flip-orange-700"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commitValue(inputValue)}
          placeholder={items.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
        />
      </div>
    </div>
  )
}
