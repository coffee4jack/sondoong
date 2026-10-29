// Contact.jsx
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Mail, CheckCircle2 } from "lucide-react"
import { fadeUp, inView, stagger } from "../lib/motion.js"

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow duration-200"

const darkButton =
  "w-full inline-flex items-center justify-center gap-2 bg-emerald-400 text-black font-semibold rounded-lg py-3 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/20"

function InquiryForm() {
  const [sent, setSent] = useState(false)

  // El mensaje de éxito desaparece solo a los 5 s
  useEffect(() => {
    if (!sent) return
    const t = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(t)
  }, [sent])

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <motion.div variants={fadeUp} className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur text-white p-8 shadow-2xl">
      <h3 className="text-2xl font-bold mb-6">Solicita Información</h3>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/90">
            Nombre Completo
          </label>
          <input type="text" id="name" name="name" required className={inputClass} placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/90">
            Correo Electrónico
          </label>
          <input type="email" id="email" name="email" required className={inputClass} placeholder="tu@email.com" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-white/90">
            Mensaje / Pregunta
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className={`${inputClass} resize-none`}
            placeholder="¿Tienes dudas sobre los vehículos permitidos o zonas de cobertura?"
          />
        </div>
        <motion.button type="submit" className={`${darkButton} text-base`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          Enviar Solicitud
        </motion.button>
        <p role="status" className="text-sm text-emerald-300 min-h-5 flex items-center gap-2">
          <AnimatePresence>
            {sent && (
              <motion.span
                key="ok"
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                ¡Gracias! Te contactaremos en breve.
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      </form>
    </motion.div>
  )
}

function GuideCard() {
  return (
    <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur text-white p-6 shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-400/20 ring-2 ring-emerald-400 flex items-center justify-center font-bold text-xl text-emerald-400">
          DG
        </div>
        <div>
          <h4 className="text-lg font-semibold">Soporte DriverGO</h4>
          <p className="text-white/70 text-sm">Atención al Conductor 24/7</p>
        </div>
      </div>
      <a href="mailto:soporte@drivergo.com" className={darkButton}>
        <Mail className="w-4 h-4" aria-hidden="true" />
        Contactar Soporte
      </a>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative z-10 py-24 px-6 scroll-mt-6">
      <motion.div
        className="max-w-7xl mx-auto rounded-3xl bg-black/30 ring-1 ring-white/15 backdrop-blur p-8 md:p-12"
        variants={stagger(0, 0.12)}
        {...inView}
      >
        <motion.h2
          variants={fadeUp}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-16 text-center text-balance text-white"
        >
          Únete a Nuestro Equipo
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <InquiryForm />
          <motion.div variants={fadeUp} className="flex flex-col gap-8">
            <p className="text-xl text-white/90 leading-relaxed text-pretty font-light">
              ¿Quieres registrar tu flota o tienes preguntas corporativas? Ponte en contacto con nosotros y responderemos de inmediato.
            </p>
            <GuideCard />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}