import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "./navbar"

export function Hero() {
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://www.elledecoration.vn/wp-content/uploads/2025/03/1-son-doong.jpg)",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
      </div>

      <Navbar />

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
        <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
          <span className="text-sm font-medium">Limited Group Expeditions</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 text-balance">Enter a Lost World.</h1>

        <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
          Explore the colossal chambers of Son Doong Cave in Vietnam, a unique ecosystem with its own jungle and weather
          system, on a fully-guided 4-day expedition.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-lg">
            <a href="#contact">Book Your Expedition</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 hover:text-white rounded-full px-8 py-4 text-lg"
          >
            <a href="#expedition">View Itinerary</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">Safety is our Priority</span>
        </div>
      </section>
    </div>
  )
}
