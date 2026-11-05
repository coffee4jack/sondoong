<script setup>
import { computed } from "vue";

const chipTones = {
  soft: "border border-ink/15 bg-white text-ink",
  dark: "bg-ink text-white",
  brand: "bg-brand text-ink",
  outline: "border border-mute text-ink",
};

const props = defineProps({ tone: { type: String, default: "soft" } });
const toneCls = computed(() => chipTones[props.tone]);
</script>

<template>
  <span class="inline-block rounded-full px-3 py-0.5 text-xs font-bold" :class="toneCls">
    <slot />
  </span>
</template>
