import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const items = [
  {
    src: "https://images.pexels.com/photos/5988831/pexels-photo-5988831.jpeg",
    title: "Viajes",
    text: "Pide en segundos, viaja en minutos.",
    cta: "Empezar",
    bg: "bg-[#04170f]",
    textColor: "text-white",
    sub: "text-white/70",
    btn: "bg-[#2a8c5e] text-white",
    href: "#",
  },
  {
    src: "https://images.unsplash.com/photo-1793443354968-0f50fdceabf3?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    title: "Comida",
    text: "Tus restaurantes favoritos, entregados rápido.",
    cta: "Ir a Comida",
    bg: "bg-[#1b3a2a]",
    textColor: "text-white",
    sub: "text-white/80",
    btn: "bg-[#2a8c5e] text-white",
    href: "#",
  },
  {
    src: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
    title: "Scooters",
    text: "Recorre la ciudad en scooters eléctricos, sin tráfico.",
    cta: "Ir a Scooters",
    bg: "bg-[#12331f]",
    textColor: "text-white",
    sub: "text-white/80",
    btn: "bg-[#e3fbe9] text-black",
    href: "#",
  },
  {
    src: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    title: "Tiendas",
    text: "Supermercado y esenciales cuando los necesites.",
    cta: "Ir a Tiendas",
    bg: "bg-[#eaf7ef]",
    textColor: "text-[#0f1f17]",
    sub: "text-[#0f1f17]/70",
    btn: "bg-[#0a2416] text-white",
    href: "#",
  },
];

export default function Services() {
  const sliderRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  const move = (direction) => {
    sliderRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-lg text-black transition hover:bg-black hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-black/5 disabled:hover:text-black";

  return (
    <section className="bg-[#f5f8f6] py-16">
      <div className="mx-auto max-w-7xl px-5">
        {/* Encabezado centrado */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#0f1f17] sm:text-5xl">
            Nuestros servicios
          </h2>
          <p className="mt-4 text-sm text-black/60">
            Los productos y funciones varían según el país. Algunas funciones
            pueden no estar disponibles en tu app.
          </p>
        </div>

        {/* Carrusel */}
        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((i, index) => (
            <motion.article
              key={i.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`relative flex h-[420px] w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl sm:w-[310px] ${i.bg}`}
            >
              {/* Imagen de fondo */}
              <img
                src={i.src}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 ${i.textColor === "text-white"
                    ? "bg-gradient-to-b from-black/70 via-black/10 to-black/20"
                    : "bg-gradient-to-b from-white/90 via-white/30 to-transparent"
                  }`}
              />

              {/* Contenido */}
              <div className={`relative z-10 p-6 ${i.textColor}`}>
                <h3 className="text-lg font-semibold">{i.title}</h3>
                <p className={`mt-2 text-sm leading-snug ${i.sub}`}>{i.text}</p>
                <a
                  href={i.href}
                  className={`mt-5 inline-flex h-9 items-center rounded-lg px-4 text-xs font-semibold transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a8c5e] ${i.btn}`}
                >
                  {i.cta}
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Flechas */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => move(-1)}
            disabled={!canPrev}
            className={arrow}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={() => move(1)}
            disabled={!canNext}
            className={arrow}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}