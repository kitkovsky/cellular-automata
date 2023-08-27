import './globals.css'
import type { Metadata } from 'next'
import { Atkinson_Hyperlegible as AtkinsonHyperlegible } from 'next/font/google'

const atkinson = AtkinsonHyperlegible({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cellular Automata',
}

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body className={atkinson.className}>{children}</body>
    </html>
  )
}
