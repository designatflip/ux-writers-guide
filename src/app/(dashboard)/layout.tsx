import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userEmail={user.email ?? null} />
      <main className="flex-1 overflow-auto bg-neutral-50 p-8">{children}</main>
    </div>
  )
}
