import { motion } from "framer-motion";

const items = [
  { icon: "🚕", title: "Viajes", text: "Llega a tu destino de forma rápida, segura y con precios claros.", bg: "bg-[#34D186]" },
  { icon: "🍔", title: "Comida", text: "Tus restaurantes favoritos entregados directamente en tu puerta.", bg: "bg-[#FFD84D]" },
  { icon: "🛴", title: "Scooters", text: "Recorre la ciudad en scooters eléctricos, sin tráfico y sin complicaciones.", bg: "bg-[#B8E4FF]" },
  { icon: "🛒", title: "Tiendas", text: "Supermercado y esenciales en minutos, cuando los necesites.", bg: "bg-[#FFB8D1]" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const card = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Services() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-extrabold tracking-tight sm:text-5xl"
      >
        Todo en una sola app
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((i) => (
          <motion.a
            href="#"
            key={i.title}
            variants={card}
            whileHover={{ y: -8 }}
            className={`group flex min-h-[300px] flex-col justify-between rounded-3xl p-7 ${i.bg}`}
          >
            <span className="text-6xl">{i.icon}</span>
            <div>
              <h3 className="text-2xl font-bold">{i.title}</h3>
              <p className="mt-2 text-sm text-black/70">{i.text}</p>
              <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
