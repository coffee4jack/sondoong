<script setup>
import { computed, ref } from "vue";
import Button from "../buttons/Button.vue";
import Card from "./Card.vue";
import Chip from "./Chip.vue";
import ChipButton from "./ChipButton.vue";
import { inputCls } from "./ui";

const ETAS = [10, 15, 20, 30];
const REASONS = ["Sin ingredientes", "Cocina saturada", "Fuera de horario", "Otro"];

const props = defineProps({
  o: { type: Object, required: true },
  now: { type: Number, required: true },
  selected: { type: Boolean, default: false },
});
const emit = defineEmits(["select", "accept", "reject", "advance"]);

const eta = ref(15);
const rejecting = ref(false);
const reason = ref("");

const elapsed = computed(() => Math.max(0, Math.floor((props.now - props.o.enteredAt) / 60000)));
const late = computed(() => elapsed.value > props.o.target);
const pct = computed(() => Math.min(100, (elapsed.value / props.o.target) * 100));
const time = computed(() =>
  new Date(props.o.enteredAt).toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" })
);

const print = () => {
  emit("select");
  window.print();
};
</script>

<template>
  <Card class="mt-3" :class="{ 'ring-2 ring-brand': selected }">
    <button type="button" class="block w-full text-left" @click="emit('select')">
      <span class="flex items-center justify-between">
        <b>#{{ o.id }}</b>
        <Chip :tone="o.priority === 'Alta' ? 'dark' : 'soft'">Prioridad {{ o.priority }}</Chip>
      </span>
      <span class="mt-1.5 block text-[13px] text-ink/65">
        Entró {{ time }} · Objetivo {{ o.target }} min · {{ late ? "Retrasado" : `${elapsed} min` }}
      </span>
      <span class="mt-2.5 block h-1.5 rounded-full bg-ink/10">
        <span
          class="block h-1.5 rounded-full"
          :class="late ? 'bg-ink' : 'bg-brand'"
          :style="{ width: `${pct}%` }"
        />
      </span>
      <span class="mt-2.5 block text-sm">{{ o.items.join(" · ") }}</span>
    </button>

    <div v-if="o.status === 'new'" class="mt-3">
      <p class="text-[13px] text-ink/65">Tiempo estimado</p>
      <div class="mt-1.5 flex flex-wrap gap-1.5">
        <ChipButton v-for="m in ETAS" :key="m" :active="eta === m" @click="eta = m">
          {{ m }} min
        </ChipButton>
      </div>
      <select
        v-if="rejecting"
        v-model="reason"
        aria-label="Motivo del rechazo"
        :class="[inputCls, 'mt-2']"
      >
        <option value="">Motivo del rechazo…</option>
        <option v-for="r in REASONS" :key="r" :value="r">{{ r }}</option>
      </select>
      <div class="mt-3 flex gap-2">
        <Button size="sm" class="flex-1" @click="emit('accept', o.id, eta)">Aceptar</Button>
        <Button
          v-if="rejecting"
          size="sm"
          variant="dark"
          class="flex-1"
          :disabled="!reason"
          @click="emit('reject', o.id, reason)"
        >
          Confirmar rechazo
        </Button>
        <Button v-else size="sm" variant="outline" class="flex-1" @click="rejecting = true">
          Rechazar
        </Button>
      </div>
    </div>

    <div v-if="o.status === 'preparing'" class="mt-3">
      <div class="flex gap-2">
        <Button size="sm" class="flex-1" @click="emit('advance', o.id, 'ready')">
          Marcar listo
        </Button>
        <Button size="sm" variant="outline" @click="print">Imprimir</Button>
      </div>
      <RouterLink to="/portal/catalogo" class="mt-2 inline-block text-[13px] underline">
        Actualizar disponibilidad
      </RouterLink>
    </div>

    <Button
      v-if="o.status === 'ready'"
      size="sm"
      variant="dark"
      class="mt-3 w-full"
      @click="emit('advance', o.id, 'delivered')"
    >
      Entregar a repartidor
    </Button>
  </Card>
</template>
