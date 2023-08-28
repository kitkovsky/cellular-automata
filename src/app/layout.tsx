import type { Metadata } from 'next'
import { Roboto_Mono as RobotoMono } from 'next/font/google'
import cn from 'classnames'
import './globals.css'

const roboto = RobotoMono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cellular Automata',
}

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, 'w-screen max-w-full bg-gray60')}>
        {children}
      </body>
    </html>
  )
}
