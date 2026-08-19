'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const sections = [
  {
    label: 'Content',
    items: [
      { href: '/entries', label: 'Glossary', exact: true },
      { href: '/entries/guidelines', label: 'Guidelines' },
      { href: '/entries/products', label: 'Products' },
      { href: '/entries/brand-constants', label: 'Brand Constants' },
      { href: '/entries/tone', label: 'Tone of Voice' },
      { href: '/entries/mechanics', label: 'Mechanics' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/settings', label: 'Settings', exact: false },
      { href: '/activity', label: 'Change Log', exact: false },
    ],
  },
]

interface DashboardSidebarProps {
  userEmail?: string | null
}

export default function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-neutral-200 bg-white px-3 py-5">
      <Link href="/" className="mb-6 px-2 text-base font-semibold text-neutral-900 hover:text-flip-orange transition-colors">
        Flip Communication Hub
      </Link>

      <nav className="flex flex-1 flex-col gap-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
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
                        ? 'bg-flip-orange-100 text-flip-orange-700'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
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

      {userEmail && (
        <div className="mt-4 border-t border-neutral-50 px-2 pt-4">
          <p className="mb-2 truncate text-xs text-neutral-600" title={userEmail}>{userEmail}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  )
}
