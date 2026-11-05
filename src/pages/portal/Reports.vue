<script setup>
import { computed, ref } from "vue";
import Button from "../../components/buttons/Button.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import Kpi from "../../components/portal/Kpi.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import { reportRanges } from "../../data/portal";
import { money } from "../../lib/beep";

const tabs = Object.keys(reportRanges).map((k) => ({ id: k, label: k }));

const range = ref("30 días");
const r = computed(() => reportRanges[range.value]);
const max = computed(() => Math.max(...r.value.bars.map(([, v]) => v)));
const net = computed(() => r.value.sales - r.value.commission);
const chartLabel = computed(
  () => `Ventas: ${r.value.bars.map(([l, v]) => `${l} ${money(v)}`).join(", ")}`
);
const print = () => window.print();
</script>

<template>
  <PageHeader :tabs="tabs" :active="range" @tab="range = $event">
    <template #action>
      <Button size="sm" @click="print">Imprimir resumen</Button>
    </template>
  </PageHeader>
  <Body>
    <div class="print-area">
      <h2 class="text-2xl font-bold">Reportes · {{ range }}</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi label="Ventas" :value="money(r.sales)" :hint="`${r.orders} pedidos`" />
        <Kpi
          label="Cancelaciones"
          :value="r.cancels"
          :hint="`${((r.cancels / r.orders) * 100).toFixed(1)} % de los pedidos`"
        />
        <Kpi label="Tiempo de preparación" :value="`${r.prep} min`" hint="Objetivo: 15 min" />
        <Kpi label="Valoración" :value="`${r.rating} / 5`" :hint="`${r.reviews} reseñas`" />
        <Kpi label="Comisiones" :value="money(r.commission)" hint="20 % de las ventas" />
        <Kpi label="Importe neto estimado" :value="money(net)" hint="Antes de ajustes" />
      </div>

      <div class="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        <Card>
          <h3 class="text-lg font-bold">Ventas por periodo</h3>
          <div role="img" :aria-label="chartLabel" class="mt-4 flex h-56 items-end gap-3">
            <div
              v-for="([label, v], i) in r.bars"
              :key="label"
              class="flex h-full flex-1 flex-col justify-end text-center"
            >
              <div
                class="rounded-t-xl"
                :class="i === r.bars.length - 1 ? 'bg-brand' : 'bg-ink/15'"
                :style="{ height: `${(v / max) * 85}%` }"
              />
              <span class="mt-2 text-xs text-ink/65">{{ label }}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 class="text-lg font-bold">Liquidaciones</h3>
          <p class="mt-2 text-sm text-ink/70">
            Consulta importes, ajustes y estado de cada periodo. Solo lectura.
          </p>
          <Button to="/portal/liquidaciones" variant="dark" class="mt-4 w-full">
            Ver liquidaciones
          </Button>
          <RouterLink to="/portal/historial" class="mt-3 inline-block text-sm underline">
            Ir al historial de pedidos
          </RouterLink>
        </Card>
      </div>
    </div>
  </Body>
</template>
