type Color = 'indigo' | 'slate' | 'green' | 'amber' | 'red'

interface BadgeProps {
  children: React.ReactNode
  color?: Color
}

const colorClasses: Record<Color, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  slate: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
}

export default function Badge({ children, color = 'slate' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
      {children}
    </span>
  )
}
