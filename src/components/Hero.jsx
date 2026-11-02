
import { motion, useScroll, useTransform } from "framer-motion";

import Button from "./buttons/Button";

export default function Hero() {
  // Detectar el desplazamiento de la página
  const { scrollY } = useScroll();

  // Reducir progresivamente la imagen
  const imageScale = useTransform(
    scrollY,
    [0, 500],
    [1, 0.95]
  );

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-20">

        {/* Contenido principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}

        >
          <h1 className="text-center text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Lorem Ipsum
          </h1>

          <p className="mx-auto mt-5 max-w-md text-center text-lg text-black/60">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quod.
          </p>

          {/* Botones */}
          <div className="mx-auto flex items-center justify-center gap-4 p-6">
            <Button
              title="Reservar Ahora"
              color="#498a4c"
              textColor="white"
            />

            <Button
              title="Reservar Ahora"
              color="#ebebeb"
              textColor="#000000"
            />
          </div>
        </motion.div>



        <motion.div
          initial={{ opacity: 0.0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >

          {/* Imagen con efecto scroll */}
          <motion.div
            style={{
              scale: imageScale,
              willChange: "transform",
            }}
            className="mt-8 w-full origin-top"
          >
            <div className="h-[640px] w-full overflow-hidden">
              <img
                src="https://images.pexels.com/photos/17445328/pexels-photo-17445328.jpeg"
                alt="Paisaje de viaje"
                loading="eager"
                className="h-full w-full object-cover rounded-2xl"
              />
            </div>
          </motion.div>
        </motion.div>

      </section>
    </>
  );
}
