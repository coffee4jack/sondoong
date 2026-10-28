import { Hero } from "@/components/site/hero"
import { Features } from "@/components/site/features"
import { Journey } from "@/components/site/journey"
import { Faq } from "@/components/site/faq"
import { Contact } from "@/components/site/contact"
import { Footer } from "@/components/site/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <Hero />
      <main>
        <Features />
        <Journey />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
