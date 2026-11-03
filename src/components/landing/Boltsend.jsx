import { motion } from "framer-motion";

export default function BoltSend() {
  return (
    <section id="send" className="bg-sand">
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-20 text-center">
        <p className="text-sm font-bold text-ink/60">Últimas novedades</p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-3 text-5xl font-bold tracking-tight text-ink sm:text-6xl"
        >
          Bolt Send
        </motion.h2>
        <p className="mt-6 text-base text-ink/60 sm:text-lg">
          Entrega de paquetes a pedido. Envía o recibe artículos el mismo día.
        </p>
        <p className="mt-5 text-base text-ink/60 sm:text-lg">
          Revisa en la app las funciones disponibles.
        </p>
        <a
          href="#"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-brand px-7 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Enviar artículos
        </a>
      </div>

      <img
        src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg"
        alt="Regalos en el asiento trasero de un auto"
        loading="lazy"
        className="h-[320px] w-full object-cover sm:h-[480px] lg:h-[600px]"
      />
    </section>
  );
}