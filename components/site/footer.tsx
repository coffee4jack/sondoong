import { Compass } from "lucide-react"
import { footerColumns } from "@/lib/site-data"
import { NewsletterForm } from "./newsletter-form"

export function Footer() {
  return (
    <footer className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/[0.03] backdrop-blur-2xl ring-1 ring-white/10 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Compass className="w-6 h-6" aria-hidden="true" />
              <span className="text-xl font-semibold">Son Doong Expeditions</span>
            </div>
            <p className="text-white/80 leading-relaxed text-pretty">
              {
                "The official tour operator for expeditions into Son Doong, the world's largest cave. We are dedicated to safety, conservation, and unforgettable adventures."
              }
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/70 hover:text-white transition-colors text-sm leading-relaxed">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-12 mb-12">
          <NewsletterForm />
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-white/60 text-sm text-center">© {new Date().getFullYear()} Son Doong Expeditions</p>
        </div>
      </div>
    </footer>
  )
}
