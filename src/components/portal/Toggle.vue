<script setup>
/**
 * Interruptor. Es "controlado": recibe `checked` y emite `change` con el nuevo valor,
 * de modo que el padre puede aceptar o rechazar el cambio (p. ej. exigir un motivo).
 */
const props = defineProps({
  checked: { type: Boolean, default: false },
  label: { type: String, default: "" },
});
const emit = defineEmits(["change"]);
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :aria-label="label"
    class="relative h-6 w-[42px] shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    :class="checked ? 'bg-brand' : 'bg-mute'"
    @click="emit('change', !props.checked)"
  >
    <span
      class="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all"
      :class="checked ? 'left-[21px]' : 'left-[3px]'"
    />
  </button>
</template>
