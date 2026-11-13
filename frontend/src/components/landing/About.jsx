import { motion } from "motion/react";
import { cn } from "../../lib/cn";

const rides = [
  { name: "Comfort", info: "2 min · 4 pasajeros", desc: "Autos grandes", price: "L 110" },
  { name: "Bolt", info: "4 min · 4 pasajeros", desc: "Autos medianos", price: "L 135" },
  { name: "XL", info: "8 min · 6 pasajeros", desc: "Capacidad para 6", price: "L 205" },
  { name: "Premium", info: "4 min · 4 pasajeros", desc: "Autos de lujo medianos", price: "L 260" },
  { name: "Bolt Drive", info: "12 min caminando · 4", desc: "VW T-Roc", price: "L 95" },
];

export default function About() {
  return (
    <section id="nosotros" className="overflow-hidden bg-brand text-ink">
      <div className="mx-auto max-w-4xl px-5 pt-20 text-center sm:pt-24">
        <p className="text-sm font-bold text-ink/70">Sobre nosotros</p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
        >
          La primera super-app de movilidad.
        </motion.h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink sm:text-lg">
          Hacemos ciudades para las personas, con mejores alternativas para cada uso de un auto
          privado: viajes, autos compartidos, scooters y entrega de comida y supermercado.
        </p>
        <a
          href="#mision"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-white px-7 text-base font-bold text-ink transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Nuestra misión
        </a>
      </div>

      {/* Teléfono en perspectiva */}
      <div
        className="mx-auto mt-16 h-[300px] max-w-3xl px-5 sm:h-[420px]"
        style={{ perspective: "900px" }}
        aria-hidden="true"
      >
        <div
          className="mx-auto w-full max-w-xl rounded-[2.5rem] border-[10px] border-ink bg-white p-5 text-ink shadow-2xl"
          style={{ transform: "rotateX(38deg)", transformOrigin: "top center" }}
        >
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-ink/20" />
          <ul>
            {rides.map((r, i) => (
              <li
                key={r.name}
                className={cn(
                  "flex items-center justify-between border-b border-ink/10 px-3 py-3",
                  i === 0 && "rounded-lg border border-brand"
                )}
              >
                <div>
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-ink/60">{r.info}</p>
                  <p className="text-xs text-ink/60">{r.desc}</p>
                </div>
                <span className="text-sm font-bold">{r.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
