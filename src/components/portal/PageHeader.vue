<script setup>
/**
 * Encabezado oscuro con esquinas redondeadas, igual que la app.
 * - `tabs`: [{ id, label }], `active`: id activo, evento `tab` con el id elegido.
 * - Slot `action`: contenido alineado a la derecha de la fila de pestañas.
 */
defineProps({
  tabs: { type: Array, default: () => [] },
  active: { type: [String, Number], default: undefined },
});
const emit = defineEmits(["tab"]);
</script>

<template>
  <header class="rounded-b-[32px] bg-ink px-5 py-6 text-white sm:px-9">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          class="grid h-12 w-12 place-items-center rounded-full bg-mute text-xs font-bold text-ink"
        >
          Logo
        </div>
        <div>
          <p class="text-sm text-mute">Bienvenido</p>
          <p class="text-xl font-bold">Restaurante El Sabor · Sucursal Centro</p>
        </div>
      </div>
      <div class="flex w-full items-center gap-3 sm:w-auto">
        <label for="portal-search" class="sr-only">Buscar</label>
        <input
          id="portal-search"
          placeholder="Buscar pedido, producto…"
          class="h-11 min-w-0 flex-1 rounded-full bg-white px-5 text-sm text-ink placeholder:text-ink/50 sm:w-80"
        />
        <button
          type="button"
          aria-label="3 notificaciones"
          class="grid h-11 w-11 place-items-center rounded-full bg-white font-bold text-ink"
        >
          3
        </button>
      </div>
    </div>

    <div v-if="tabs.length > 0 || $slots.action" class="mt-6 flex flex-wrap items-center gap-2">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        :aria-pressed="active === t.id"
        class="h-9 rounded-full px-4 text-sm transition focus-visible:outline-2 focus-visible:outline-brand"
        :class="
          active === t.id
            ? 'bg-brand font-bold text-ink'
            : 'bg-white/10 text-white hover:bg-white/20'
        "
        @click="emit('tab', t.id)"
      >
        {{ t.label }}
      </button>
      <div v-if="$slots.action" class="ml-auto">
        <slot name="action" />
      </div>
    </div>
  </header>
</template>
