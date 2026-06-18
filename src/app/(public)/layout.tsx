import PublicHeader from '@/components/PublicHeader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2eb' }}>
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
