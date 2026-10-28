import { features, type Feature } from "@/lib/site-data"

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-white/80 leading-relaxed">{description}</p>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="relative z-10 py-24 px-6 scroll-mt-6">
      <h2 className="sr-only">Why travel with us</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}
