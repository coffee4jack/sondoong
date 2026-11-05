<script setup>
import { computed, ref } from "vue";

const tabs = {
  Viajes: {
    title: "La forma rápida y económica de viajar.",
    text: "Disponible para dispositivos iOS y Android.",
    cta: "Obtener Bolt",
  },
  Entregas: {
    title: "Tu comida y tus compras, en minutos.",
    text: "Disponible para dispositivos iOS y Android.",
    cta: "Obtener Bolt Food",
  },
};

const apps = [
  { name: "Bolt", label: "Bolt" },
  { name: "Bolt Food", label: "Bolt Food" },
  { name: "Bolt Courier", label: "Courier" },
];

const active = ref("Viajes");
const t = computed(() => tabs[active.value]);
</script>

<template>
  <section id="app" class="bg-ink py-20 text-white">
    <div class="mx-auto max-w-6xl px-5">
      <div class="text-center">
        <h2 class="text-4xl font-bold tracking-tight sm:text-6xl">Descarga nuestras apps</h2>
        <p class="mt-5 text-base text-white/60 sm:text-lg">
          Disponible para dispositivos iOS y Android.
        </p>
      </div>

      <div class="mt-16 grid items-center gap-12 md:grid-cols-2">
        <!-- Teléfono con íconos -->
        <div
          class="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-tl-[3rem] border-l-[14px] border-t-[14px] border-brand bg-ink p-8"
          aria-hidden="true"
        >
          <div class="grid grid-cols-3 gap-5">
            <div v-for="a in apps" :key="a.name" class="text-center">
              <div
                class="flex aspect-square items-center justify-center rounded-2xl bg-brand text-ink text-sm font-bold leading-tight"
              >
                {{ a.label }}
              </div>
              <p class="mt-2 text-xs text-white/70">{{ a.name }}</p>
            </div>
          </div>
        </div>

        <!-- Pestañas -->
        <div>
          <div role="tablist" class="flex gap-1 border-b border-white/10">
            <button
              v-for="k in Object.keys(tabs)"
              :key="k"
              role="tab"
              :aria-selected="active === k"
              class="-mb-px border-b-2 px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              :class="
                active === k
                  ? 'border-brand text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              "
              @click="active = k"
            >
              {{ k }}
            </button>
          </div>

          <h3 class="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">{{ t.title }}</h3>
          <p class="mt-4 text-base text-white/60">{{ t.text }}</p>
          <a
            href="#"
            class="mt-8 inline-flex h-12 items-center rounded-xl bg-brand px-6 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {{ t.cta }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
