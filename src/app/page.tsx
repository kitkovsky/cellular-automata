import { Link } from '@/components/Link'

export default function HomePage() {
  const pagesMap = [
    { name: 'game-of-life', href: '/game-of-life' },
    { name: 'seeds', href: '/seeds' },
    { name: "brian's brain", href: '/brians-brain' },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      {pagesMap.map(({ name, href }) => (
        <Link href={href} className="text-7xl font-semibold" key={href}>
          {name}
        </Link>
      ))}
    </main>
  )
}
