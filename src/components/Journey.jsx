import { motion } from "motion/react"
import { journeySteps } from "../data/site-data.js"
import { fadeUp, inView, stagger } from "../lib/motion.js"

function JourneyCard({ step, title, description }) {
  return (
    <motion.li
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
      className="group rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 min-h-80 flex flex-col justify-between hover:ring-emerald-400/40 hover:bg-white/[0.07] transition-colors duration-300"
    >
      <div>
        <div className="text-4xl font-extrabold text-emerald-400/80 mb-4 font-mono">
          {String(step).padStart(2, "0")}.
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-white/80 leading-relaxed text-sm">{description}</p>
      </div>
      <div className="w-8 group-hover:w-16 h-1 bg-emerald-400/30 group-hover:bg-emerald-400/70 rounded-full mt-6 transition-[width,background-color] duration-500" />
    </motion.li>
  )
}

export function Journey() {
  return (
    <section id="como-empezar" className="relative z-10 py-24 px-6 scroll-mt-6">
      <motion.div
        className="max-w-7xl mx-auto rounded-3xl bg-black/40 ring-1 ring-white/15 backdrop-blur p-8 md:p-12"
        variants={stagger(0, 0.1)}
        {...inView}
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance bg-gradient-to-r from-white via-white/90 to-emerald-200 bg-clip-text text-transparent">
            Cómo empezar con DriverGO
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty font-light">
            Cuatro sencillos pasos para estar al volante y generar ingresos en tu ciudad.
          </p>
        </motion.div>

        <motion.ol variants={stagger(0, 0.12)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {journeySteps.map((s, i) => (
            <JourneyCard key={s.title} step={i + 1} title={s.title} description={s.description} />
          ))}
        </motion.ol>

        <motion.div variants={fadeUp} className="text-center">
          <motion.a
            href="#contact"
            className="inline-block bg-emerald-400 text-black rounded-full px-12 py-4 text-lg font-semibold hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/20"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Iniciar Registro
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}