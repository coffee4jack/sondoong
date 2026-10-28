import { motion } from "motion/react"
import { journeySteps } from "../data/site-data.js"
import { fadeUp, inView, stagger } from "../lib/motion.js"

function JourneyCard({ step, title, description }) {
  return (
    <motion.li
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 min-h-80 flex flex-col"
    >
      <div className="text-3xl font-bold text-white/60 mb-4">{String(step).padStart(2, "0")}.</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-white/80 leading-relaxed text-sm">{description}</p>
    </motion.li>
  )
}

export function Journey() {
  return (
    <section id="expedition" className="relative z-10 py-24 px-6 scroll-mt-6">
      <motion.div
        className="max-w-7xl mx-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12"
        variants={stagger(0, 0.1)}
        {...inView}
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Your Epic Journey</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty">
            {"From jungle treks to underground camps, here's what to expect."}
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
            className="inline-block bg-white text-black rounded-full px-12 py-4 text-lg font-semibold hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Check Availability
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
