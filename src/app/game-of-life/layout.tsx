import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delightful Animations | Game of Life',
}

export default function GameOfLifeLayout({
  children,
}: {
  children: JSX.Element
}) {
  return children
}
