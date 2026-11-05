<script setup>
import { computed } from "vue";

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-brand hover:brightness-110",
  dark: "bg-ink hover:bg-ink/85",
  light: "border border-ink/15 bg-white hover:bg-ink/5",
  outline: "border border-mute bg-transparent hover:bg-ink/5",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-base",
};

const textColors = {
  white: "text-white",
  black: "text-black",
  ink: "text-ink",
};

/**
 * Botón único de la app.
 *
 * - `to` renderiza un <RouterLink>
 * - `href` renderiza un <a>
 * - Sin ninguno renderiza un <button>
 * - Acepta contenido por slot
 * - También acepta `text` o `title`
 * - `textColor` permite cambiar el color del texto
 */
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },

  size: {
    type: String,
    default: "md",
  },

  pill: {
    type: Boolean,
    default: false,
  },

  to: {
    type: [String, Object],
    default: undefined,
  },

  href: {
    type: String,
    default: undefined,
  },

  type: {
    type: String,
    default: "button",
  },

  text: {
    type: String,
    default: undefined,
  },

  title: {
    type: String,
    default: undefined,
  },

  textColor: {
    type: String,
    default: "ink",
  },
});

const cls = computed(() => {
  const textColorClass = textColors[props.textColor] ?? "text-ink";

  return [
    base,
    variants[props.variant] ?? variants.primary,
    sizes[props.size] ?? sizes.md,
    textColorClass,
    props.pill ? "rounded-full" : "rounded-xl",
  ].join(" ");
});
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