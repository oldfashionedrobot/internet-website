import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@components/Navigation'

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
      <body>
        <Navigation />

        {children}
      </body>
    </html>
  )
}
