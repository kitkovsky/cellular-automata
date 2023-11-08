import { Link } from '@/components/Link'

export default function HomePage() {
  const pagesMap = [
    { name: 'game-of-life', href: '/game-of-life' },
    { name: 'seeds', href: '/seeds' },
    { name: "brian's brain", href: '/brians-brain' },
    { name: 'wildfire', href: '/wildfire' },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      {pagesMap.map(({ name, href }) => (
        <Link href={href} className="text-7xl font-semibold" key={href}>
          {name}
        </Link>
      ))}
      <h1>this is new</h1>
    </main>
  )
}
