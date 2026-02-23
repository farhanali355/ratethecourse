import { Hero } from "@/components/home/Hero"
import { Features } from "@/components/home/Features"
import { Trending } from "@/components/home/Trending"
import { CTA } from "@/components/home/CTA"
import { redirect } from "next/navigation"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = params.code

  // Fail-safe: If user lands on home page with an auth code (e.g. from misconfigured Google redirect)
  // redirect them to the proper auth callback route.
  if (code && typeof code === 'string') {
    const role = params.role ? `&role=${params.role}` : ''
    redirect(`/auth/callback?code=${code}${role}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col">
        <Hero />
        <Features />
        <Trending />
        <CTA />
        <br />
        <br />
        <br />

      </div>
    </main>
  )
}
