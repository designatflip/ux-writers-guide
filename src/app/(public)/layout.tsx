import PublicHeader from '@/components/PublicHeader'
import { getSearchData } from '@/lib/search-data'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchData = await getSearchData()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2eb' }}>
      <PublicHeader searchData={searchData} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
