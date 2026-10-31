import { motion } from "framer-motion";

export default function AppDownload() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-[#34D186] p-10 md:grid-cols-2 md:p-16"
      >
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Descarga la app de Bolt
          </h2>
          <p className="mt-4 max-w-md text-lg text-black/70">
            Pide viajes, comida y scooters desde tu teléfono en cuestión de segundos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a whileHover={{ scale: 1.05 }} href="#" className="rounded-xl bg-black px-6 py-3 text-white">
              <span className="block text-[10px] uppercase opacity-70">Descárgala en</span>
              <span className="text-lg font-semibold">App Store</span>
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} href="#" className="rounded-xl bg-black px-6 py-3 text-white">
              <span className="block text-[10px] uppercase opacity-70">Disponible en</span>
              <span className="text-lg font-semibold">Google Play</span>
            </motion.a>
          </div>
        </div>

        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="mx-auto flex h-80 w-44 items-center justify-center rounded-[2rem] border-8 border-black bg-white text-6xl shadow-2xl"
        >
          📱
        </motion.div>
      </motion.div>
    </section>
  );
}
