<script setup>
import { computed, ref } from "vue";
import Button from "../../components/buttons/Button.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import Chip from "../../components/portal/Chip.vue";
import Field from "../../components/portal/Field.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import { inputCls } from "../../components/portal/ui";
import { branches, historyRows, statuses } from "../../data/portal";
import { money } from "../../lib/beep";

const tone = { Entregado: "brand", "En curso": "soft", Cancelado: "dark" };
const initial = { from: "", to: "", status: "", branch: "", min: "" };
const headers = ["Pedido", "Fecha", "Sucursal", "Estado", "Total"];

const f = ref({ ...initial });

const rows = computed(() =>
  historyRows.filter(
    (r) =>
      (!f.value.from || r.date >= f.value.from) &&
      (!f.value.to || r.date <= f.value.to) &&
      (!f.value.status || r.status === f.value.status) &&
      (!f.value.branch || r.branch === f.value.branch) &&
      (!f.value.min || r.total >= Number(f.value.min))
  )
);
const total = computed(() =>
  rows.value.reduce((s, r) => s + (r.status === "Cancelado" ? 0 : r.total), 0)
);

const reset = () => {
  f.value = { ...initial };
};
const print = () => window.print();
</script>

<template>
  <PageHeader />
  <Body>
    <h2 class="text-2xl font-bold">Historial de pedidos</h2>
    <Card class="mt-4" as="form" aria-label="Filtros" @reset="reset">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Desde">
          <input v-model="f.from" type="date" :class="inputCls" />
        </Field>
        <Field label="Hasta">
          <input v-model="f.to" type="date" :class="inputCls" />
        </Field>
        <Field label="Estado">
          <select v-model="f.status" :class="inputCls">
            <option value="">Todos</option>
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </Field>
        <Field label="Sucursal">
          <select v-model="f.branch" :class="inputCls">
            <option value="">Todas</option>
            <option v-for="b in branches" :key="b" :value="b">{{ b }}</option>
          </select>
        </Field>
        <Field label="Total mínimo (L)">
          <input v-model="f.min" type="number" min="0" :class="inputCls" />
        </Field>
      </div>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" class="text-sm text-ink/70">
          {{ rows.length }} pedidos · ventas netas de cancelados {{ money(total) }}
        </p>
        <div class="flex gap-2">
          <Button type="reset" size="sm" variant="outline">Limpiar</Button>
          <Button size="sm" variant="dark" @click="print">Imprimir resumen</Button>
        </div>
      </div>
    </Card>

    <Card class="print-area mt-5 overflow-x-auto">
      <table class="w-full min-w-[560px] text-sm">
        <thead>
          <tr class="text-left text-xs uppercase text-ink/65">
            <th v-for="h in headers" :key="h" scope="col" class="px-2 py-3">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id" class="border-t border-ink/10">
            <td class="px-2 py-3 font-bold">#{{ r.id }}</td>
            <td class="px-2 py-3">{{ r.date }}</td>
            <td class="px-2 py-3">{{ r.branch }}</td>
            <td class="px-2 py-3">
              <Chip :tone="tone[r.status]">{{ r.status }}</Chip>
            </td>
            <td class="px-2 py-3">{{ money(r.total) }}</td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="5" class="px-2 py-6 text-center text-ink/65">
              Sin resultados con estos filtros.
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </Body>
</template>
