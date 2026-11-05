<script setup>
import { computed, ref } from "vue";
import Button from "../../components/buttons/Button.vue";
import Chat from "../../components/portal/Chat.vue";
import OrderCard from "../../components/portal/OrderCard.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import ChipButton from "../../components/portal/ChipButton.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import Toggle from "../../components/portal/Toggle.vue";
import { initialChats, initialOrders, makeOrder } from "../../data/portal";
import useNow from "../../composables/useNow";
import { beep, money } from "../../lib/beep";

const COLUMNS = [
  ["new", "Nuevos"],
  ["preparing", "En preparación"],
  ["ready", "Listos"],
];
const FORMATS = ["Ticket 80 mm", "A4", "Resumen"];

const now = useNow(15000);
const orders = ref(initialOrders);
const filter = ref("all");
const selectedId = ref(initialOrders[0].id);
const alertId = ref(initialOrders[0].id);
const sound = ref(true);
const format = ref(FORMATS[0]);
const notice = ref("");

const active = computed(() =>
  orders.value.filter((o) => ["new", "preparing", "ready"].includes(o.status))
);
const selected = computed(
  () => active.value.find((o) => o.id === selectedId.value) ?? active.value[0]
);
const alertOrder = computed(() =>
  active.value.find((o) => o.id === alertId.value && o.status === "new")
);
const visibleColumns = computed(() =>
  COLUMNS.filter(([id]) => filter.value === "all" || filter.value === id)
);

const tabs = computed(() => [
  { id: "all", label: "Todos" },
  ...COLUMNS.map(([id, label]) => ({
    id,
    label: `${label} · ${active.value.filter((o) => o.status === id).length}`,
  })),
]);

const setStatus = (id, status, extra = {}) => {
  orders.value = orders.value.map((o) => (o.id === id ? { ...o, status, ...extra } : o));
};

const simulate = () => {
  const id = "A23" + Math.random().toString(36).slice(2, 6).toUpperCase();
  orders.value = [makeOrder(id, ["1× Hamburguesa clásica"], 125, 0, 15, "Media"), ...orders.value];
  alertId.value = id;
  if (sound.value) beep();
};

const accept = (oid, eta) => {
  setStatus(oid, "preparing", { target: eta });
  notice.value = `Pedido #${oid} aceptado · ${eta} min estimados.`;
};
const reject = (oid, reason) => {
  setStatus(oid, "rejected");
  notice.value = `Pedido #${oid} rechazado · motivo: ${reason}.`;
};
const print = () => window.print();

const advance = (oid, st) => {
  setStatus(oid, st);
  if (st === "delivered") notice.value = `Pedido #${oid} entregado al repartidor.`;
};
</script>

<template>
  <PageHeader :tabs="tabs" :active="filter" @tab="filter = $event">
    <template #action>
      <Button size="sm" @click="simulate">Simular pedido nuevo</Button>
    </template>
  </PageHeader>
  <Body>
    <h2 class="sr-only">Panel de pedidos</h2>

    <div
      v-if="alertOrder"
      role="alert"
      class="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-brand px-5 py-4 text-ink"
    >
      <div>
        <b>Nuevo pedido #{{ alertOrder.id }}</b>
        <p class="text-sm">
          {{ sound ? "Alerta sonora activa" : "Alerta visual" }} · requiere tu atención
        </p>
      </div>
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-2 text-sm">
          Sonido <Toggle :checked="sound" label="Alerta sonora" @change="sound = $event" />
        </span>
        <Button size="sm" variant="dark" @click="alertId = null">Reconocer alerta</Button>
      </div>
    </div>
    <p v-if="notice" role="status" class="mt-3 text-sm text-ink/70">{{ notice }}</p>

    <div
      class="mt-6 grid items-start gap-5 md:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_340px]"
    >
      <section
        v-for="[id, label] in visibleColumns"
        :key="id"
        :aria-label="label"
        :class="filter === 'all' ? '' : 'md:col-span-3 xl:col-span-3'"
      >
        <h3 class="text-lg font-bold">{{ label }}</h3>
        <OrderCard
          v-for="o in active.filter((x) => x.status === id)"
          :key="o.id"
          :o="o"
          :now="now"
          :selected="selected?.id === o.id"
          @select="selectedId = o.id"
          @accept="accept"
          @reject="reject"
          @advance="advance"
        />
        <p v-if="active.every((o) => o.status !== id)" class="mt-3 text-sm text-ink/65">
          Sin pedidos.
        </p>
      </section>

      <!-- Detalle: impresión y comunicación -->
      <Card
        v-if="selected"
        as="aside"
        class="md:col-span-3 xl:col-span-1"
        aria-label="Detalle del pedido"
      >
        <h3 class="text-lg font-bold">Pedido #{{ selected.id }}</h3>
        <div class="print-area mt-3 rounded-2xl border border-dashed border-mute p-4 text-[13px]">
          <b>El Sabor · Centro</b>
          <p class="text-ink/65">Formato: {{ format }}</p>
          <ul class="mt-3 space-y-0.5">
            <li v-for="i in selected.items" :key="i">{{ i }}</li>
          </ul>
          <p class="mt-3 font-bold">Total {{ money(selected.total) }}</p>
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <ChipButton v-for="f in FORMATS" :key="f" :active="format === f" @click="format = f">
            {{ f }}
          </ChipButton>
        </div>
        <Button class="mt-3 w-full" @click="print">Imprimir orden</Button>

        <h3 class="mt-6 text-base font-bold">Comunicación</h3>
        <Chat :key="selected.id" :initial="initialChats" />
        <p class="mt-3 text-[13px] text-ink/65">
          Los datos personales del cliente permanecen ocultos.
        </p>
      </Card>
    </div>
  </Body>
</template>
