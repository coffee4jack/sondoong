<script setup>
import { motion, useScroll, useTransform } from "motion-v";
import Button from "../buttons/Button.vue";

// Detectar el desplazamiento de la página
const { scrollY } = useScroll();

// Reducir progresivamente la imagen
const imageScale = useTransform(scrollY, [0, 500], [1, 0.95]);
</script>

<template>
  <section class="relative overflow-hidden bg-white pt-20">
    <!-- Contenido principal -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.8, ease: 'easeOut' }"
    >
      <h1 class="text-center text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        Muévete a tu manera
      </h1>

      <p class="mx-auto mt-5 max-w-md text-center text-lg text-ink/60">
        Pide un viaje, súbete y listo. Viajes rápidos y a buen precio, cuando los necesites.
      </p>

      <!-- Botones -->
      <div class="mx-auto flex items-center justify-center gap-3 p-6">
        <Button size="lg" to="/portal">Reservar Ahora</Button>
        <Button size="lg" variant="outline" href="#app">Descargar App</Button>
      </div>
    </motion.div>

    <motion.div
      :initial="{ opacity: 0, scale: 0.97 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 0.8, ease: 'easeOut' }"
    >
      <!-- Imagen con efecto scroll -->
      <motion.div
        :style="{ scale: imageScale, willChange: 'transform' }"
        class="mt-8 w-full origin-top"
      >
        <div class="h-[640px] w-full overflow-hidden">
          <img
            src="https://images.pexels.com/photos/17445328/pexels-photo-17445328.jpeg"
            alt="Paisaje de viaje"
            loading="eager"
            class="h-full w-full rounded-2xl object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  </section>
</template>
