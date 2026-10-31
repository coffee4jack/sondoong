import { motion } from "framer-motion";

const cards = [
  { icon: "💼", title: "Bolt Business", text: "Gestiona los viajes y entregas de tu equipo desde un solo panel." },
  { icon: "🤝", title: "Socios de flota", text: "Haz crecer tu flota y administra a tus conductores fácilmente." },
  { icon: "🏪", title: "Para restaurantes", text: "Llega a más clientes con Bolt Food y aumenta tus ventas." },
];

export default function Business() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Soluciones para tu negocio
        </h2>
        <p className="mt-4 text-lg text-black/60">
          Herramientas pensadas para empresas, flotas y comercios de todos los tamaños.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#34D186]/20 text-3xl">
              {c.icon}
            </div>
            <h3 className="mt-6 text-xl font-bold">{c.title}</h3>
            <p className="mt-2 text-black/60">{c.text}</p>
            <a href="#" className="mt-6 inline-block font-semibold text-[#1a9e63] hover:underline">
              Saber más →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
