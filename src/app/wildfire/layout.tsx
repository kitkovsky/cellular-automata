import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delightful Animations | Wildfire',
}

export default function WildfireLayout({
  children,
}: {
  children: JSX.Element
}) {
  return children
}
