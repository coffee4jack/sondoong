<script setup>
import { motion } from "motion-v";

// Cambia esta imagen por la tuya (ideal: PNG/JPG ancho, de al menos 1600px)
const IMAGE = "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg";
</script>

<template>
  <section class="overflow-hidden bg-ink text-white">
    <!-- Texto centrado -->
    <div class="mx-auto max-w-3xl px-5 pt-20 text-center sm:pt-24">
      <motion.h2
        :initial="{ opacity: 0, y: 24 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.6 }"
        class="text-5xl font-bold tracking-tight sm:text-7xl"
      >
        Conduce con Bolt
      </motion.h2>

      <p class="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
        Trabaja con tu propio horario, cobra de forma rápida y transparente y aprovecha comisiones
        competitivas. Además, cuentas con soporte las 24 horas para que te enfoques en lo
        importante: ganar a tu ritmo.
      </p>

      <motion.button
        :while-hover="{ scale: 1.03 }"
        :while-press="{ scale: 0.97 }"
        class="mt-10 rounded-xl bg-brand px-8 py-4 text-base font-bold text-ink transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Regístrate como conductor
      </motion.button>
    </div>

    <!-- Imagen grande que sale por abajo -->
    <div class="relative mx-auto mt-16 h-[280px] max-w-[1400px] sm:h-[420px] lg:h-[520px]">
      <img
        :src="IMAGE"
        alt="Conductor Bolt"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover object-center"
      />
      <!-- Degradado para fundir la imagen con el fondo oscuro -->
      <div class="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-transparent" />
      <div
        class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent sm:w-48"
      />
      <div
        class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent sm:w-48"
      />
    </div>
  </section>
</template>
