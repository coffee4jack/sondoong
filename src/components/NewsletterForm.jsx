// NewsletterForm.jsx
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!subscribed) return
    const t = setTimeout(() => setSubscribed(false), 5000)
    return () => clearTimeout(t)
  }, [subscribed])

  function handleSubmit(e) {
    e.preventDefault()
    setSubscribed(true)
    e.currentTarget.reset()
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-4 text-white">Recibe Novedades e Incentivos</h3>
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Ingresa tu correo"
          className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-white/5 ring-1 ring-white/20 backdrop-blur border-0 text-white placeholder:text-white/50 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />
        <motion.button
          type="submit"
          className="shrink-0 bg-emerald-400 text-black font-semibold rounded-lg px-6 hover:bg-emerald-300 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Suscribirse
        </motion.button>
      </form>
      <p role="status" className="text-sm text-emerald-300 mt-3 min-h-5">
        <AnimatePresence>
          {subscribed && (
            <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ¡Suscripción exitosa! Te mantendremos informado.
            </motion.span>
          )}
        </AnimatePresence>
      </p>
    </div>
  )
}