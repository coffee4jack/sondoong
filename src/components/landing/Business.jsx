import { motion } from "framer-motion";

const blocks = [
  {
    eyebrow: "Gana dinero como conductor",
    title: "Conduce y gana dinero",
    text: "Más de 200 millones de usuarios te enviarán solicitudes de viaje. Cuando la demanda es alta, puedes ganar aún más.",
    cta: "Regístrate para conducir",
    img: "https://images.pexels.com/photos/5988831/pexels-photo-5988831.jpeg",
    alt: "Conductora sonriendo dentro de un auto",
  },
  {
    eyebrow: "Sé un repartidor de Bolt",
    title: "Gana con cada entrega",
    text: "Tú decides cuándo y con qué frecuencia entregas: entre semana, por las tardes, los fines de semana o solo una hora cuando quieras.",
    cta: "Regístrate como repartidor",
    img: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
    alt: "Repartidor entregando un pedido",
  },
  {
    eyebrow: "Aumenta tus ingresos como comercio",
    title: "Aumenta tus ventas y llega a nuevos clientes",
    text: "Millones de usuarios piden comida y productos a restaurantes y tiendas como la tuya.",
    cta: "Regístrate en Bolt Food",
    img: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    alt: "Dueño de un comercio con una tableta",
  },
];

export default function Business() {
  return (
    <section id="gana" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Gana dinero con Bolt
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/60">
          Únete a más de 4,5 millones de socios en todo el mundo que ganan con Bolt. Para
          conductores, repartidores, comercios y dueños de flotas que buscan nuevas formas de
          aumentar sus ingresos.
        </p>

        <div className="mt-16 space-y-16 sm:space-y-20">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
            >
              <img
                src={b.img}
                alt={b.alt}
                loading="lazy"
                className={`aspect-[4/3] w-full rounded-2xl object-cover md:max-w-[525px] ${
                  i % 2 === 1 ? "md:order-2 md:ml-auto" : ""
                }`}
              />
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-sm font-bold text-ink/60">{b.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {b.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink/60">{b.text}</p>
                <a
                  href="#app"
                  className="mt-8 inline-flex h-12 items-center rounded-xl bg-brand px-6 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {b.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
