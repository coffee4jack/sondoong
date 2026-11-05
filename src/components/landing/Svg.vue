<script setup>
/** Icono SVG genérico: `inner` es el contenido interno y `size` las clases de tamaño. */
defineProps({
  inner: { type: String, required: true },
  size: { type: String, default: "h-4 w-4" },
});
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="size"
    aria-hidden="true"
    v-html="inner"
  />
</template>
