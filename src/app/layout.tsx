import './globals.css'
import type { ReactNode } from 'react'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jet = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  title: 'Accounting App',
  description: 'TallyPrime-style accounting system'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jet.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
