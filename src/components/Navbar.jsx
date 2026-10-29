import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Car, Menu, X, UserCheck } from "lucide-react"

// Cada href apunta a un id que existe en la página
export const navLinks = [
  { label: "Inicio", href: "#home" },
  { label: "Beneficios", href: "#features" },
  { label: "Cómo empezar", href: "#como-empezar" },
  { label: "Preguntas", href: "#faq" },
  { label: "Contacto", href: "#contact" },
]

// transition-colors (no transition-all) para no chocar con las transformaciones de motion
const pill =
  "px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full text-sm font-medium transition-colors duration-300"

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.25, ease: "easeInOut" } },
}

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
}

// Brillo que cruza el botón al pasar el cursor (propagado por variants desde el padre)
const shineVariants = {
  rest: { x: "-100%" },
  hover: { x: "100%", transition: { duration: 0.6, ease: "easeInOut" } },
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  // Cierra el menú con Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e) => e.key === "Escape" && setMobileMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileMenuOpen])

  // Pequeño cambio de fondo al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      id="home"
      className="relative z-50 w-full"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-6" aria-label="Navegación principal">
        <motion.a
          href="#home"
          className={`flex items-center gap-2.5 ${pill} hover:bg-black/60 hover:ring-emerald-400/50 ${scrolled ? "bg-black/60" : ""}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 1.2 }}
          >
            <Car className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </motion.div>
          <span className="font-bold tracking-tight text-white text-base">DriverGO</span>
        </motion.a>

        <ul className="hidden xl:flex items-center gap-1.5">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            >
              <motion.a
                href={link.href}
                className={`${pill} hover:bg-white/10 hover:text-emerald-300 hover:ring-white/40 block`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                {link.label}
              </motion.a>
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            className={`${pill} hidden sm:flex items-center gap-2 hover:bg-black/60 hover:ring-emerald-400/30`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Portal Driver</span>
          </motion.a>

          <motion.a
            href="#contact"
            className="relative overflow-hidden px-6 py-2 bg-emerald-400 text-black font-semibold text-sm rounded-full shadow-lg shadow-emerald-400/20"
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            animate="rest"
          >
            <span className="relative z-10">Registrarme</span>
            <motion.span
              aria-hidden="true"
              variants={shineVariants}
              className="absolute inset-0 bg-white/30 pointer-events-none"
            />
          </motion.a>

          <motion.button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={`${pill} xl:hidden p-2.5 text-white hover:bg-black/60`}
            whileTap={{ scale: 0.92 }}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  className="block"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  className="block"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="xl:hidden bg-black/90 backdrop-blur-2xl border-b border-white/10 px-6 py-6 shadow-2xl rounded-b-3xl overflow-hidden"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <motion.li key={link.label} variants={mobileLinkVariants}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl text-white/90 hover:text-emerald-400 hover:bg-white/5 font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
