import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Delightful Animations | Brian's Brain",
}

export default function BriansBrainLayout({
  children,
}: {
  children: JSX.Element
}) {
  return children
}
