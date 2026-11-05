<script setup>
/** Botón tipo "chip". El @click se aplica directamente al <button>. */
defineProps({ active: { type: Boolean, default: false } });
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    class="rounded-full px-3.5 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-brand"
    :class="
      active
        ? 'bg-ink font-bold text-white'
        : 'border border-ink/15 bg-white text-ink hover:bg-ink/5'
    "
  >
    <slot />
  </button>
</template>
