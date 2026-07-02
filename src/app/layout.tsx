import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flip Communication Hub',
  description: 'Everything you need to communicate clearly, on-brand, and consistently.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  )
}
