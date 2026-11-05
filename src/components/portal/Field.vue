<script setup>
defineProps({ label: { type: String, default: "" } });
</script>

<template>
  <label class="block text-sm text-ink/70">
    {{ label }}
    <span class="mt-1.5 block"><slot /></span>
  </label>
</template>
