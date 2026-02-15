import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LocalAPI - Browser-based API Client',
  description: 'A browser-based API client that stores collections locally with zero cloud dependencies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}