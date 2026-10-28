import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/site-data"

const pill = "px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full"

export function Navbar() {
  return (
    <header className="relative z-10">
      <nav className="flex items-center justify-between p-6" aria-label="Main navigation">
        <a href="#" className={`flex items-center gap-2 ${pill}`}>
          <Compass className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">Son Doong Expeditions</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className={`${pill} block hover:bg-black/50 transition-colors`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#" className={`${pill} hover:bg-black/50 transition-colors`}>
            Login
          </a>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-6">
            <a href="#contact">Book Now</a>
          </Button>
        </div>
      </nav>
    </header>
  )
}
