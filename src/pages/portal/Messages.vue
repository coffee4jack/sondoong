<script setup>
import { computed, ref } from "vue";
import Chat from "../../components/portal/Chat.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import Chip from "../../components/portal/Chip.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import { threads } from "../../data/portal";

const id = ref(threads[0].id);
const t = computed(() => threads.find((x) => x.id === id.value) ?? threads[0]);
</script>

<template>
  <PageHeader />
  <Body>
    <h2 class="text-2xl font-bold">Mensajes</h2>
    <div class="mt-4 grid items-start gap-5 lg:grid-cols-[340px_1fr]">
      <ul class="space-y-3" aria-label="Conversaciones">
        <li v-for="x in threads" :key="x.id">
          <button
            type="button"
            :aria-pressed="x.id === id"
            class="w-full rounded-[20px] bg-white p-4 text-left shadow-sm focus-visible:outline-2 focus-visible:outline-brand"
            :class="{ 'ring-2 ring-brand': x.id === id }"
            @click="id = x.id"
          >
            <span class="flex items-center justify-between">
              <b>Pedido #{{ x.orderId }}</b>
              <Chip>{{ x.with }}</Chip>
            </span>
            <span class="mt-1 block truncate text-sm text-ink/65">
              {{ x.messages.at(-1).text }}
            </span>
          </button>
        </li>
      </ul>

      <Card>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-lg font-bold">Pedido #{{ t.orderId }} · {{ t.with }}</h3>
          <RouterLink to="/portal/pedidos" class="text-sm underline">Ver pedido</RouterLink>
        </div>
        <div class="mt-3">
          <Chat :key="t.id" :initial="{ [t.with]: t.messages }" />
        </div>
        <p class="mt-3 text-[13px] text-ink/65">
          La comunicación se limita al contexto del pedido. Los datos personales del cliente
          permanecen ocultos.
        </p>
      </Card>
    </div>
  </Body>
</template>
