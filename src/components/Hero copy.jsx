import { motion } from "motion/react"
import { Lock } from "lucide-react"
import { Navbar } from "./Navbar.jsx"
import { fadeUp, stagger } from "../lib/motion.js"

const glass = "bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full"

export function Hero() {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      <motion.section
        className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center"
        variants={stagger(0.2, 0.15)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className={`mb-6 px-4 py-2 ${glass}`}>
          <span className="text-sm font-medium">Limited Group Expeditions</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-light tracking-tight mb-6 text-balance">
          Enter a Lost World.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty"
        >
          Explore the colossal chambers of Son Doong Cave in Vietnam, a unique ecosystem with its own jungle and weather
          system, on a fully-guided 4-day expedition.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-16">
          <motion.a
            href="#contact"
            className="bg-white text-black font-medium rounded-full px-8 py-4 text-lg hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Your Expedition
          </motion.a>
          <motion.a
            href="#expedition"
            className={`${glass} font-medium px-8 py-4 text-lg hover:bg-black/60 transition-colors`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            View Itinerary
          </motion.a>
        </motion.div>

        <motion.div variants={fadeUp} className={`flex items-center gap-2 px-4 py-2 ${glass}`}>
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">Safety is our Priority</span>
        </motion.div>
      </motion.section>
    </div>
  )
}
