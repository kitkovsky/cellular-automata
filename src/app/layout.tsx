import type { Metadata } from 'next'
import { GeistMono } from 'geist/font'
import cn from 'classnames'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cellular Automata',
}

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistMono.variable,
          'mx-auto h-full max-h-screen w-screen max-w-screen-2xl bg-gray60 px-4 font-mono md:px-6 lg:px-8',
        )}
      >
        {children}
      </body>
    </html>
  )
}
