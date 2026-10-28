import { motion } from "motion/react"
import { Compass } from "lucide-react"
import { navLinks } from "../data/site-data.js"

const pill = "px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full"

export function Navbar() {
  return (
    <motion.header
      className="relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="flex items-center justify-between gap-4 p-6" aria-label="Main navigation">
        <a href="#" className={`flex items-center gap-2 ${pill}`}>
          <Compass className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">Son Doong Expeditions</span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className={`${pill} block hover:bg-black/60 transition-colors`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#" className={`${pill} hidden sm:block hover:bg-black/60 transition-colors`}>
            Login
          </a>
          <motion.a
            href="#contact"
            className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Now
          </motion.a>
        </div>
      </nav>
    </motion.header>
  )
}
