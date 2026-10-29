import { motion } from "motion/react"
import { Wallet, Clock, ShieldCheck, Smartphone, Route, Headphones } from "lucide-react"
import { fadeUp, inView, stagger } from "../lib/motion.js"

const features = [
  { icon: Wallet, title: "Ingresos justos", description: "Ves cuánto ganas por cada entrega antes de aceptarla, sin comisiones ocultas." },
  { icon: Clock, title: "Tu propio horario", description: "Conéctate cuando quieras y desconéctate cuando lo necesites. Tú decides tu jornada." },
  { icon: ShieldCheck, title: "Respaldo y seguridad", description: "Te acompañamos en cada ruta con protocolos claros y asistencia ante cualquier incidente." },
  { icon: Smartphone, title: "App sencilla", description: "Recibe pedidos, navega y confirma entregas desde una sola aplicación." },
  { icon: Route, title: "Rutas eficientes", description: "Entregas agrupadas por zona para que aproveches mejor tu tiempo y tu combustible." },
  { icon: Headphones, title: "Soporte 24/7", description: "Un equipo de atención al conductor disponible a cualquier hora del día." },
]

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.li
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 hover:ring-emerald-400/40 hover:bg-white/[0.07] transition-colors duration-300"
    >
      <motion.div
        className="w-12 h-12 rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/30 flex items-center justify-center mb-6 text-emerald-400"
        whileHover={{ rotate: -8, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </motion.div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-white/80 leading-relaxed text-sm">{description}</p>
    </motion.li>
  )
}

export function Features() {
  return (
    <section id="features" className="relative z-10 py-24 px-6 scroll-mt-6">
      <motion.div
        className="max-w-7xl mx-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12"
        variants={stagger(0, 0.1)}
        {...inView}
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance text-white">
            Por qué conducir con DriverGO
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty font-light">
            Herramientas y condiciones pensadas para que trabajes con libertad y tranquilidad.
          </p>
        </motion.div>

        <motion.ul variants={stagger(0, 0.1)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}
