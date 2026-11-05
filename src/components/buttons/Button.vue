<script setup>
import { computed } from "vue";

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-brand text-ink hover:brightness-110",
  dark: "bg-ink text-white hover:bg-ink/85",
  light: "border border-ink/15 bg-white text-ink hover:bg-ink/5",
  outline: "border border-mute bg-transparent text-ink hover:bg-ink/5",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-base",
};

/**
 * Botón único de la app.
 * - `to` renderiza un <RouterLink>, `href` un <a>, y sin ninguno un <button>.
 * - Acepta contenido por slot (también `text` o `title` por compatibilidad).
 * - Las clases extra (`class`) y los eventos (`@click`) se aplican al elemento raíz.
 */
const props = defineProps({
  variant: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  pill: { type: Boolean, default: false },
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
  type: { type: String, default: "button" },
  text: { type: String, default: undefined },
  title: { type: String, default: undefined },
});

const cls = computed(
  () =>
    `${base} ${variants[props.variant]} ${sizes[props.size]} ${props.pill ? "rounded-full" : "rounded-xl"}`
);
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="cls">
    <slot>{{ text ?? title }}</slot>
  </RouterLink>
  <a v-else-if="href" :href="href" :class="cls">
    <slot>{{ text ?? title }}</slot>
  </a>
  <button v-else :type="type" :class="cls">
    <slot>{{ text ?? title }}</slot>
  </button>
</template>
