import { Link } from '@components/Link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/game-of-life" className="text-7xl font-semibold ">
        Game of life
      </Link>
    </main>
  )
}
