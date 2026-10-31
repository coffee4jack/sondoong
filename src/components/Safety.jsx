import { motion } from "framer-motion";

const stats = [
  { n: "24/7", l: "Soporte al cliente" },
  { n: "100%", l: "Conductores verificados" },
  { n: "SOS", l: "Botón de emergencia en la app" },
  { n: "GPS", l: "Seguimiento del viaje en vivo" },
];

export default function Safety() {
  return (
    <section className="bg-[#F3FBF7] py-20">
      <div className="mx-auto max-w-7xl px-5">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          Tu seguridad es lo primero
        </motion.h2>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl bg-white p-6 text-center shadow-sm"
            >
              <p className="text-4xl font-extrabold text-[#34D186]">{s.n}</p>
              <p className="mt-2 text-sm text-black/60">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
