<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { motion, AnimatePresence } from "motion-v";
import Svg from "./Svg.vue";
import { icons } from "./navIcons";

/* ---------- Datos del menú ---------- */
const menu = {
  Products: [
    ["Rides", "Rider safety", "Become a driver", "Bolt Send"],
    ["Scooters", "Scooter safety", "Report an issue", "Safety lab"],
    ["Bolt Market", "Become a courier", "Add a restaurant or store"],
    ["Bolt Food", "Become a courier", "Add a restaurant or store", "Grocery Delivery"],
    ["Bolt Drive", "FAQ", "Report a vehicle"],
    ["Bolt for Business", "Benefits", "Work profile", "Products", "Bolt Food for Business"],
    ["E-bikes", "Safety lab", "Report an issue", "FAQ"],
    ["Bolt Plus", "Benefits", "How to join", "FAQ"],
  ],
  "Earn with Bolt": [
    ["Become a driver", "Requirements", "Earnings", "FAQ"],
    ["Become a courier", "Requirements", "Weekly payments", "FAQ"],
    ["Fleet owners", "Sign up", "Fleet tools", "FAQ"],
    ["Restaurants & stores", "Add your business", "Bolt Food for Business"],
  ],
  Company: [
    ["About Bolt", "Our story", "Press", "Blog"],
    ["Careers", "Open roles", "Life at Bolt", "Students"],
    ["Investors", "Reports", "Sustainability"],
    ["Contact", "Media kit", "Partnerships"],
  ],
  Safety: [
    ["Rider safety", "Driver safety", "Courier safety"],
    ["Scooter safety", "E-bike safety", "Safety lab"],
    ["Community guidelines", "Report an issue", "Emergency help"],
  ],
  Support: [
    ["Help center", "Riders", "Drivers", "Couriers"],
    ["Bolt Food", "Scooters", "Bolt Drive", "Bolt Plus"],
    ["Contact us", "Report an issue", "Lost items"],
  ],
  Cities: [
    ["Europe", "Tallinn", "Warsaw", "Lisbon", "Prague"],
    ["Africa", "Lagos", "Nairobi", "Cape Town", "Accra"],
    ["Latin America", "Mexico City", "Bogotá", "Lima"],
    ["Asia & Middle East", "Riyadh", "Dubai", "Tbilisi"],
  ],
};

const tabs = Object.keys(menu);

const side = [
  { title: "Become a driver", text: "Make money on your terms", icon: "driver" },
  { title: "Become a courier", text: "Deliver food and get paid weekly", icon: "courier" },
  {
    title: "Add a restaurant or store",
    text: "Reach more customers and increase earnings",
    icon: "restaurant",
  },
  {
    title: "Sign up as a fleet owner",
    text: "Add your fleet to Bolt and boost your income",
    icon: "fleet",
  },
  {
    title: "Bolt for Business",
    text: "Bolt products and services scaled-up for your business",
    icon: "business",
  },
];

const socials = ["facebook", "x", "instagram", "linkedin", "tiktok"];

/* ---------- Estado ---------- */
const open = ref(false);
const tab = ref("Products");
const year = new Date().getFullYear();

// Bloquea el scroll del fondo mientras el menú está abierto
watch(open, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});

// Cierra con la tecla Escape
const onKey = (e) => e.key === "Escape" && (open.value = false);
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => {
  window.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});

// Cierra el menú al navegar a otra ruta
const route = useRoute();
watch(
  () => route.path,
  () => {
    open.value = false;
  }
);

/* Contenedor común: más angosto, con margen a los lados */
const CONTAINER = "mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-14";
</script>

<template>
  <!-- Barra superior -->
  <motion.div
    :initial="{ opacity: 0, x: -20, scale: 0.96 }"
    :animate="{ opacity: 1, x: 0, scale: 1 }"
    :transition="{ duration: 0.6 }"
  >
    <header class="sticky top-0 z-[60] border-b border-ink/5 bg-white/90 backdrop-blur-md">
      <div :class="[CONTAINER, 'flex h-[68px] items-center justify-between']">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="relative text-[28px] font-bold leading-none tracking-tighter text-ink"
        >
          Bolt
          <span class="absolute -bottom-1 left-[17px] h-[5px] w-[5px] rounded-full bg-ink" />
        </RouterLink>

        <div class="flex items-center gap-5 sm:gap-7">
          <button class="flex items-center gap-2.5 text-sm font-bold">
            <span
              class="flex h-[18px] w-[26px] items-center justify-center rounded-[4px] bg-ink text-white"
            >
              <Svg :inner="icons.globe" size="h-3.5 w-3.5" />
            </span>
            EN
          </button>

          <a href="#" class="hidden text-sm font-medium sm:block">Support</a>
          <RouterLink to="/portal" class="hidden text-sm font-medium sm:block">
            Para comercios
          </RouterLink>

          <button
            class="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-ink/85"
          >
            Register
          </button>

          <button
            :aria-label="open ? 'Close menu' : 'Open menu'"
            :aria-expanded="open"
            class="flex h-8 w-8 items-center justify-center"
            @click="open = !open"
          >
            <Svg v-if="open" :inner="icons.close" size="h-6 w-6" />
            <Svg v-else :inner="icons.menu" size="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  </motion.div>

  <!-- Menú desplegable a pantalla completa -->
  <AnimatePresence>
    <motion.div
      v-if="open"
      key="menu"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.2 }"
      class="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pt-[113px]"
    >
      <div :class="CONTAINER">
        <!-- Paneles: principal flexible + lateral de 280px -->
        <div class="grid gap-3 lg:grid-cols-[1fr_280px]">
          <!-- Panel principal -->
          <motion.div
            :initial="{ y: 12, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :transition="{ delay: 0.05, duration: 0.3 }"
            class="rounded-3xl bg-white p-6 lg:h-[600px] lg:p-8"
          >
            <!-- Pestañas -->
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <button
                v-for="t in tabs"
                :key="t"
                class="rounded-xl px-[9px] py-[9px] text-[15px] font-bold leading-6 transition"
                :class="tab === t ? 'bg-brand text-ink' : 'hover:bg-ink/5'"
                @click="tab = t"
              >
                {{ t }}
              </button>
            </div>

            <!-- Enlaces: 4 columnas -->
            <AnimatePresence mode="wait">
              <motion.div
                :key="tab"
                :initial="{ opacity: 0, y: 6 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0 }"
                :transition="{ duration: 0.15 }"
                class="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 px-[9px] lg:grid-cols-4 lg:gap-y-12"
              >
                <ul v-for="(group, gi) in menu[tab]" :key="gi" class="flex flex-col gap-5">
                  <li v-for="(l, i) in group" :key="l + i">
                    <a
                      href="#"
                      class="block max-w-[160px] text-[15px] font-medium leading-6 text-ink hover:underline"
                    >
                      {{ l }}
                    </a>
                  </li>
                </ul>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <!-- Panel lateral -->
          <motion.aside
            :initial="{ y: 12, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :transition="{ delay: 0.1, duration: 0.3 }"
            class="rounded-3xl bg-white p-6 lg:h-[600px] lg:p-8 lg:pt-10"
          >
            <ul class="space-y-9">
              <li v-for="s in side" :key="s.title">
                <a href="#" class="flex items-start justify-between gap-3">
                  <span class="flex gap-[11px]">
                    <span class="mt-1 shrink-0 text-ink"><Svg :inner="icons[s.icon]" /></span>
                    <span>
                      <span class="block text-[15px] font-bold leading-6">{{ s.title }}</span>
                      <span class="mt-[5px] block text-[13px] leading-[18px] text-ink/65">
                        {{ s.text }}
                      </span>
                    </span>
                  </span>
                  <span class="mt-1 shrink-0"><Svg :inner="icons.chevron" /></span>
                </a>
              </li>
            </ul>
          </motion.aside>
        </div>

        <!-- Pie del menú -->
        <div
          class="mt-14 flex flex-col items-start justify-between gap-4 pb-12 text-[13px] text-ink/60 sm:flex-row sm:items-center"
        >
          <div class="flex gap-8 pl-[11px]">
            <a v-for="name in socials" :key="name" href="#" class="transition hover:text-ink">
              <Svg :inner="icons[name]" size="h-[18px] w-[18px]" />
            </a>
          </div>
          <div class="flex flex-wrap items-center gap-x-[18px] gap-y-1">
            <a href="#" class="hover:text-ink">Terms &amp; Conditions</a>
            <a href="#" class="hover:text-ink">Privacy</a>
            <a href="#" class="hover:text-ink">Cookies</a>
            <span>© {{ year }} Bolt Technology OÜ</span>
          </div>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
</template>
