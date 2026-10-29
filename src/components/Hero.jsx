import { motion, useReducedMotion } from "motion/react"
import { Lock, ChevronDown } from "lucide-react"
import { Navbar } from "./Navbar.jsx"
import { fadeUp, stagger } from "../lib/motion.js"

// transition-colors: transition-all choca con las transformaciones de motion
const glass = "bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full transition-colors duration-300"

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      <motion.section
        className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100svh-120px)] px-6 pb-16 text-center"
        variants={stagger(0.2, 0.15)}
        initial="hidden"
        animate="visible"
      >
        {/* leading-[1.1] + pb evitan que bg-clip-text recorte la g y la q */}
        <motion.h1
          variants={fadeUp}
          className="text-6xl md:text-8xl font-light tracking-tight leading-[1.1] pb-2 mb-6 text-balance bg-gradient-to-r from-emerald-400 via-teal-200 to-green-400 bg-[length:200%_auto] bg-clip-text text-transparent"
          animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          Conduce cuando quieras, <br /> gana lo que mereces.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty font-light"
        >
          Genera ingresos a tu propio ritmo completando entregas en tu ciudad con DriverGO. Maneja tus propios horarios con total libertad y respaldo.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-16">
          <motion.a
            href="#contact"
            className="bg-emerald-400 text-black font-semibold rounded-full px-8 py-4 text-lg hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/25"
            whileHover={{ scale: 1.04, boxShadow: "0px 0px 25px rgba(52, 211, 153, 0.4)" }}
            whileTap={{ scale: 0.97 }}
          >
            Descargar App Driver
          </motion.a>
          <motion.a
            href="#como-empezar"
            className={`${glass} font-medium px-8 py-4 text-lg hover:bg-black/60 hover:ring-white/40`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver Requisitos
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={`flex items-center gap-2 px-4 py-2 ${glass} hover:ring-emerald-400/40`}
          whileHover={{ y: -2 }}
        >
          <Lock className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span className="text-sm font-medium text-white/90">Tu Seguridad es Nuestra Prioridad</span>
        </motion.div>
      </motion.section>

      {/* Indicador de scroll */}
      <motion.a
        href="#features"
        aria-label="Ir a la siguiente sección"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-emerald-400 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: reduceMotion ? 0 : [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.6 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
      >
        <ChevronDown className="w-6 h-6" aria-hidden="true" />
      </motion.a>
    </div>
  )
}
