import { Button } from "@/components/ui/button"
import { journeySteps } from "@/lib/site-data"

type JourneyCardProps = {
  step: number
  title: string
  description: string
}

function JourneyCard({ step, title, description }: JourneyCardProps) {
  return (
    <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 min-h-80 flex flex-col">
      <div className="text-3xl font-bold text-white/60 mb-4">{String(step).padStart(2, "0")}.</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-white/80 leading-relaxed text-sm">{description}</p>
    </li>
  )
}

export function Journey() {
  return (
    <section id="expedition" className="relative z-10 py-24 px-6 scroll-mt-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Your Epic Journey</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty">
            {"From jungle treks to underground camps, here's what to expect."}
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {journeySteps.map((s, i) => (
            <JourneyCard key={s.title} step={i + 1} title={s.title} description={s.description} />
          ))}
        </ol>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-4 text-lg font-semibold"
          >
            <a href="#contact">Check Availability</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
