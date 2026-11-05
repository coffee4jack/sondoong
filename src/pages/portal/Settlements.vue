<script setup>
import { computed, ref } from "vue";
import Button from "../../components/buttons/Button.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import Chip from "../../components/portal/Chip.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import { settlements } from "../../data/portal";
import { money } from "../../lib/beep";

const net = (s) => s.gross - s.commission + s.adjustments.reduce((a, [, v]) => a + v, 0);
const signed = (n) => (n < 0 ? `− ${money(-n)}` : `+ ${money(n)}`);

const id = ref(settlements[0].id);
const s = computed(() => settlements.find((x) => x.id === id.value) ?? settlements[0]);
const print = () => window.print();
</script>

<template>
  <PageHeader>
    <template #action>
      <Button size="sm" @click="print">Imprimir detalle</Button>
    </template>
  </PageHeader>
  <Body>
    <h2 class="text-2xl font-bold">Liquidaciones</h2>
    <div class="mt-4 grid items-start gap-5 lg:grid-cols-[340px_1fr]">
      <ul class="space-y-3" aria-label="Periodos">
        <li v-for="x in settlements" :key="x.id">
          <button
            type="button"
            :aria-pressed="x.id === id"
            class="w-full rounded-[20px] bg-white p-4 text-left shadow-sm focus-visible:outline-2 focus-visible:outline-brand"
            :class="{ 'ring-2 ring-brand': x.id === id }"
            @click="id = x.id"
          >
            <span class="flex items-center justify-between">
              <b>{{ x.period }}</b>
              <Chip :tone="x.status === 'Pagada' ? 'brand' : 'dark'">{{ x.status }}</Chip>
            </span>
            <span class="mt-1 block text-sm text-ink/65">Neto {{ money(net(x)) }}</span>
          </button>
        </li>
      </ul>

      <Card class="print-area">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-lg font-bold">{{ s.period }}</h3>
          <Chip :tone="s.status === 'Pagada' ? 'brand' : 'dark'">{{ s.status }}</Chip>
        </div>
        <table class="mt-3 w-full text-sm">
          <tbody>
            <tr class="border-b border-ink/10">
              <th scope="row" class="py-3 text-left font-normal">Ventas brutas</th>
              <td class="py-3 text-right">{{ money(s.gross) }}</td>
            </tr>
            <tr class="border-b border-ink/10">
              <th scope="row" class="py-3 text-left font-normal">Comisión Bolt</th>
              <td class="py-3 text-right">{{ signed(-s.commission) }}</td>
            </tr>
            <tr v-for="[label, v] in s.adjustments" :key="label" class="border-b border-ink/10">
              <th scope="row" class="py-3 text-left font-normal">{{ label }}</th>
              <td class="py-3 text-right">{{ signed(v) }}</td>
            </tr>
            <tr>
              <th scope="row" class="py-3 text-left">Importe neto</th>
              <td class="py-3 text-right text-lg font-bold">{{ money(net(s)) }}</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-3 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/75">
          Solo lectura: los importes los calcula el sistema financiero y no se pueden modificar
          desde el portal.
        </p>
      </Card>
    </div>
  </Body>
</template>
