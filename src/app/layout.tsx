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
      <body
        className={cn(
          roboto.className,
          'mx-auto h-full max-h-screen w-screen max-w-screen-2xl bg-gray60 px-4 md:px-6 lg:px-8',
        )}
      >
        {children}
      </body>
    </html>
  )
}
