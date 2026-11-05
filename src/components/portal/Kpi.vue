<script setup>
import Card from "./Card.vue";

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: "" },
});
</script>

<template>
  <Card>
    <p class="text-sm text-ink/65">{{ label }}</p>
    <p class="mt-1.5 text-3xl font-bold">{{ value }}</p>
    <p class="mt-1 text-[13px] text-ink/65">{{ hint }}</p>
  </Card>
</template>
