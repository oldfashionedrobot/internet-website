import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Track',
  description: 'Track all your junk and stuff'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
