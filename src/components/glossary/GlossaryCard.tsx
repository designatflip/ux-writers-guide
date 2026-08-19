import Badge from '@/components/ui/Badge'
import type { GlossaryTerm } from '@/types'

interface GlossaryCardProps {
  term: GlossaryTerm
}

export default function GlossaryCard({ term }: GlossaryCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-flip-orange-200 hover:shadow-sm transition-all">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">
            {term.term_bahasa || term.term}
          </h3>
          {term.term_bahasa && (
            <p className="mt-0.5 text-xs text-neutral-400">{term.term}</p>
          )}
        </div>
        {term.category && (
          <Badge color="indigo">{term.category}</Badge>
        )}
      </div>
      <p className="text-sm leading-relaxed text-neutral-600">{term.definition}</p>
      {term.avoid && term.avoid.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-crimson">Avoid</p>
          <div className="flex flex-wrap gap-1.5">
            {term.avoid.map((a) => (
              <Badge key={a} color="red">{a}</Badge>
            ))}
          </div>
        </div>
      )}
      {term.tags && term.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {term.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}
