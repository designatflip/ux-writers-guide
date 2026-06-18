'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sections = [
  {
    label: 'Content',
    items: [
      { href: '/entries', label: 'Glossary', exact: true },
      { href: '/entries/guidelines', label: 'Guidelines' },
      { href: '/entries/tone', label: 'Tone of Voice' },
      { href: '/entries/mechanics', label: 'Mechanics' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/settings', label: 'Settings', exact: false },
    ],
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-slate-200 bg-white px-3 py-5">
      <Link href="/" className="mb-6 px-2 text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
        UX Writers Guide
      </Link>

      <nav className="flex flex-1 flex-col gap-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
