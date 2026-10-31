import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["Inicio", "Blog", "Noticias", "Ubicaciones", "FAQs", "Comunidad", "Soporte"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="min-w-screen  pl-66 pr-66">
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/5"
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 ">
            <a href="#" className="text-2xl font-extrabold tracking-tight text-[#2f2f2f]">
              Bolt <br />
            </a>

            <nav className="hidden items-center gap-8 lg:flex">
              {links.map((l) => (
                <a key={l} href="#" className="text-sm font-medium text-black/70 transition hover:text-black">
                  {l}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <button className="text-sm font-medium px-4 py-2 rounded-full hover:bg-black/5 transition">
                ES
              </button>
              <button className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#09090B] text-white hover:bg-black/80 transition">
                Iniciar sesión
              </button>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2"
              aria-label="Menú"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 bg-black transition ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-6 bg-black transition ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-6 bg-black transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-black/5 bg-white lg:hidden"
              >
                <div className="flex flex-col gap-1 p-5">
                  {links.map((l) => (
                    <a key={l} href="#" className="py-3 text-lg font-medium">
                      {l}
                    </a>
                  ))}
                  <button className="mt-3 rounded-full bg-[#09090B] py-3 font-semibold text-white">
                    Iniciar sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>
    </>
  );
}
