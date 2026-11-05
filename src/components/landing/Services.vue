<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { motion } from "motion-v";

const items = [
  {
    src: "https://images.pexels.com/photos/5988831/pexels-photo-5988831.jpeg",
    title: "Viajes",
    text: "Pide en segundos, viaja en minutos.",
    cta: "Empezar",
    bg: "bg-ink",
    textColor: "text-white",
    sub: "text-white/70",
    btn: "bg-brand text-ink",
    href: "#",
  },
  {
    src: "https://images.unsplash.com/photo-1793443354968-0f50fdceabf3?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    title: "Comida",
    text: "Tus restaurantes favoritos, entregados rápido.",
    cta: "Ir a Comida",
    bg: "bg-ink",
    textColor: "text-white",
    sub: "text-white/80",
    btn: "bg-brand text-ink",
    href: "#",
  },
  {
    src: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
    title: "Scooters",
    text: "Recorre la ciudad en scooters eléctricos, sin tráfico.",
    cta: "Ir a Scooters",
    bg: "bg-ink",
    textColor: "text-white",
    sub: "text-white/80",
    btn: "bg-white text-ink",
    href: "#",
  },
  {
    src: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    title: "Tiendas",
    text: "Supermercado y esenciales cuando los necesites.",
    cta: "Ir a Tiendas",
    bg: "bg-white",
    textColor: "text-ink",
    sub: "text-ink/70",
    btn: "bg-ink text-white",
    href: "#",
  },
];

const sliderRef = ref(null);
const canPrev = ref(false);
const canNext = ref(true);

const updateArrows = () => {
  const el = sliderRef.value;
  if (!el) return;
  canPrev.value = el.scrollLeft > 4;
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
};

onMounted(() => {
  updateArrows();
  window.addEventListener("resize", updateArrows);
});
onUnmounted(() => window.removeEventListener("resize", updateArrows));

const move = (direction) => {
  sliderRef.value?.scrollBy({ left: direction * 340, behavior: "smooth" });
};

const arrow =
  "flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-lg text-ink transition hover:bg-ink hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-ink/5 disabled:hover:text-ink";
</script>

<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-7xl px-5">
      <!-- Encabezado centrado -->
      <div class="mx-auto max-w-xl text-center">
        <h2 class="text-4xl font-bold tracking-tight text-ink sm:text-5xl">Nuestros servicios</h2>
        <p class="mt-4 text-sm text-ink/60">
          Los productos y funciones varían según el país. Algunas funciones pueden no estar
          disponibles en tu app.
        </p>
      </div>

      <!-- Carrusel -->
      <div
        ref="sliderRef"
        class="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll="updateArrows"
      >
        <motion.article
          v-for="(i, index) in items"
          :key="i.title"
          :initial="{ opacity: 0, y: 30 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :in-view-options="{ once: true }"
          :transition="{ duration: 0.45, delay: index * 0.08 }"
          class="relative flex h-[420px] w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl sm:w-[310px]"
          :class="i.bg"
        >
          <!-- Imagen de fondo -->
          <img
            :src="i.src"
            alt=""
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div
            class="absolute inset-0"
            :class="
              i.textColor === 'text-white'
                ? 'bg-gradient-to-b from-ink/70 via-ink/10 to-ink/20'
                : 'bg-gradient-to-b from-white/90 via-white/30 to-transparent'
            "
          />

          <!-- Contenido -->
          <div class="relative z-10 p-6" :class="i.textColor">
            <h3 class="text-lg font-bold">{{ i.title }}</h3>
            <p class="mt-2 text-sm leading-snug" :class="i.sub">{{ i.text }}</p>
            <a
              :href="i.href"
              class="mt-5 inline-flex h-9 items-center rounded-lg px-4 text-xs font-bold transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              :class="i.btn"
            >
              {{ i.cta }}
            </a>
          </div>
        </motion.article>
      </div>

      <!-- Flechas -->
      <div class="mt-6 flex justify-end gap-2">
        <button :disabled="!canPrev" :class="arrow" aria-label="Anterior" @click="move(-1)">
          ‹
        </button>
        <button :disabled="!canNext" :class="arrow" aria-label="Siguiente" @click="move(1)">
          ›
        </button>
      </div>
    </div>
  </section>
</template>
