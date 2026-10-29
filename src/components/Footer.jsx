import { motion } from "motion/react"
import { Car } from "lucide-react"
import { footerColumns } from "../data/site-data.js"
import { NewsletterForm } from "./NewsletterForm.jsx"
import { fadeUp, inView } from "../lib/motion.js"

export function Footer() {
  return (
    <footer className="relative z-10 py-24 px-6">
      <motion.div
        variants={fadeUp}
        {...inView}
        className="max-w-7xl mx-auto rounded-3xl bg-white/[0.03] backdrop-blur-2xl ring-1 ring-white/10 p-8 md:p-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Car className="w-6 h-6 text-emerald-400" aria-hidden="true" />
              <span className="text-xl font-bold text-white">DriverGO</span>
            </div>
            <p className="text-white/80 leading-relaxed text-pretty font-light">
              La plataforma líder de logística y entregas de última milla. Conectamos comercios, clientes y conductores con tecnología transparente e ingresos justos.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-emerald-400">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="inline-block text-white/70 hover:text-white hover:translate-x-1 transition-[color,transform] duration-200 text-sm leading-relaxed">
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
          <p className="text-white/60 text-sm text-center">© {new Date().getFullYear()} DriverGO Inc. Todos los derechos reservados.</p>
        </div>
      </motion.div>
    </footer>
  )
}