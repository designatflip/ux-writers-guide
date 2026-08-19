type Color = 'indigo' | 'slate' | 'green' | 'amber' | 'red'

interface BadgeProps {
  children: React.ReactNode
  color?: Color
}

const colorClasses: Record<Color, string> = {
  indigo: 'bg-flip-orange-100 text-flip-orange-900 ring-flip-orange/20',
  slate: 'bg-neutral-50 text-neutral-900 ring-neutral-400/20',
  green: 'bg-jade-100 text-jade-900 ring-jade/20',
  amber: 'bg-golden-100 text-golden-900 ring-golden/20',
  red: 'bg-crimson-100 text-crimson-900 ring-crimson/20',
}

export default function Badge({ children, color = 'slate' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
      {children}
    </span>
  )
}
