<script setup>
import { motion } from "motion-v";

const rides = [
  { name: "Comfort", info: "2 min · 4 pasajeros", desc: "Autos grandes", price: "L 110" },
  { name: "Bolt", info: "4 min · 4 pasajeros", desc: "Autos medianos", price: "L 135" },
  { name: "XL", info: "8 min · 6 pasajeros", desc: "Capacidad para 6", price: "L 205" },
  { name: "Premium", info: "4 min · 4 pasajeros", desc: "Autos de lujo medianos", price: "L 260" },
  { name: "Bolt Drive", info: "12 min caminando · 4", desc: "VW T-Roc", price: "L 95" },
];
</script>

<template>
  <section id="nosotros" class="overflow-hidden bg-brand text-ink">
    <div class="mx-auto max-w-4xl px-5 pt-20 text-center sm:pt-24">
      <p class="text-sm font-bold text-ink/70">Sobre nosotros</p>
      <motion.h2
        :initial="{ opacity: 0, y: 24 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }"
        :transition="{ duration: 0.6 }"
        class="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
      >
        La primera super-app de movilidad.
      </motion.h2>
      <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink sm:text-lg">
        Hacemos ciudades para las personas, con mejores alternativas para cada uso de un auto
        privado: viajes, autos compartidos, scooters y entrega de comida y supermercado.
      </p>
      <a
        href="#mision"
        class="mt-8 inline-flex h-12 items-center rounded-xl bg-white px-7 text-base font-bold text-ink transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Nuestra misión
      </a>
    </div>

    <!-- Teléfono en perspectiva -->
    <div
      class="mx-auto mt-16 h-[300px] max-w-3xl px-5 sm:h-[420px]"
      style="perspective: 900px"
      aria-hidden="true"
    >
      <div
        class="mx-auto w-full max-w-xl rounded-[2.5rem] border-[10px] border-ink bg-white p-5 text-ink shadow-2xl"
        style="transform: rotateX(38deg); transform-origin: top center"
      >
        <div class="mx-auto mb-4 h-1 w-16 rounded-full bg-ink/20" />
        <ul>
          <li
            v-for="(r, i) in rides"
            :key="r.name"
            class="flex items-center justify-between border-b border-ink/10 px-3 py-3"
            :class="{ 'rounded-lg border border-brand': i === 0 }"
          >
            <div>
              <p class="text-sm font-bold">{{ r.name }}</p>
              <p class="text-xs text-ink/60">{{ r.info }}</p>
              <p class="text-xs text-ink/60">{{ r.desc }}</p>
            </div>
            <span class="text-sm font-bold">{{ r.price }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
