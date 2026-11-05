<script setup>
/** Tarjeta. `as` cambia la etiqueta raíz (div, aside, form...). */
defineProps({ as: { type: String, default: "div" } });
</script>

<template>
  <component :is="as" class="rounded-[20px] border border-ink/10 bg-white p-5 shadow-sm">
    <slot />
  </component>
</template>
