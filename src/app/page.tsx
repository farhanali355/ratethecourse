import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { Features } from "@/components/home/Features"
import { Trending } from "@/components/home/Trending"
import { CTA } from "@/components/home/CTA"
export default async function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header showSearch={true} />
      <div className="flex flex-col">
        <Hero />
        <Features />
        <Trending />
        <CTA />
        <br />
        <br />
        <br />

      </div>
      <Footer />
    </main>
  )
}
