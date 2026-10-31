
import { useRef } from "react";
import { motion } from "framer-motion";

const items = [
  {
    src: "https://images.pexels.com/photos/5988831/pexels-photo-5988831.jpeg",
    title: "Viajes",
    text: "Llega a tu destino de forma rápida, segura y con precios claros."
  },
  {
    src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    title: "Comida",
    text: "Tus restaurantes favoritos entregados directamente en tu puerta."
  },
  {
    src: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
    title: "Scooters",
    text: "Recorre la ciudad en scooters eléctricos, sin tráfico y sin complicaciones."
  },
  {
    src: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    title: "Tiendas",
    text: "Supermercado y esenciales en minutos, cuando los necesites."
  },
];

export default function Services() {
  const sliderRef = useRef(null);

  const move = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction * 350,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-20">

      <div className="flex items-center justify-between">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          Todo en una sola app
        </motion.h2>



        {/* Carrusel */}
        <div
          ref={sliderRef}
          className="mt-12 flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {items.map((i, index) => (
            <motion.a
              href="#"
              key={i.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex min-h-[350px] min-w-[280px] flex-1 snap-start flex-col justify-end overflow-hidden rounded-3xl sm:min-w-[320px]"
            >

              <img
                src={i.src}
                alt={i.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="relative z-10 p-7 text-white">
                <h3 className="text-2xl font-bold">
                  {i.title}
                </h3>

                <p className="mt-2 text-sm text-white/80">
                  {i.text}
                </p>

                <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition group-hover:translate-x-1">
                  →
                </span>
              </div>

            </motion.a>
          ))}
        </div>



      </div>


      <br />
      {/* Flechas */}
      <div className="flex justify-right items-right gap-3">
        <button
          onClick={() => move(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-2xl transition hover:bg-black hover:text-white"
          aria-label="Anterior"
        >
          ←
        </button>

        <button
          onClick={() => move(1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-2xl transition hover:bg-black hover:text-white"
          aria-label="Siguiente"
        >
          →
        </button>
      </div>


    </section>
  );
}
