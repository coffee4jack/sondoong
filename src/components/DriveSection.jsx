import { motion } from "framer-motion";

const perks = [
  "Trabaja con tu propio horario",
  "Cobra de forma rápida y transparente",
  "Comisiones competitivas",
  "Soporte las 24 horas",
];

export default function DriveSection() {
  return (
    <section className="bg-[#09090B] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-[#34D186] text-9xl"
        >
          🧑‍✈️
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Conduce con Bolt y gana a tu ritmo
          </h2>
          <ul className="mt-8 space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-lg text-white/80">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#34D186] text-sm font-bold text-black">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 rounded-full bg-[#34D186] px-8 py-4 font-bold text-black"
          >
            Regístrate como conductor
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
