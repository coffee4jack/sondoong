<script setup>
import { ref } from "vue";
import ChipButton from "./ChipButton.vue";
import Button from "../buttons/Button.vue";
import { inputCls } from "./ui";

/**
 * Chat en contexto de pedido.
 * `initial` = { Contacto: [{ from: "me" | "them", text }] }
 * Se copia al montar, así que para reiniciarlo el padre usa `:key`.
 */
const props = defineProps({ initial: { type: Object, required: true } });

const contacts = Object.keys(props.initial);
const who = ref(contacts[0]);
const msgs = ref(Object.fromEntries(Object.entries(props.initial).map(([k, v]) => [k, [...v]])));
const text = ref("");

const send = () => {
  const t = text.value.trim();
  if (!t) return;
  msgs.value = {
    ...msgs.value,
    [who.value]: [...(msgs.value[who.value] ?? []), { from: "me", text: t }],
  };
  text.value = "";
};
</script>

<template>
  <div>
    <div v-if="contacts.length > 1" class="flex gap-1.5">
      <ChipButton v-for="c in contacts" :key="c" :active="who === c" @click="who = c">
        {{ c }}
      </ChipButton>
    </div>
    <div role="log" aria-live="polite" class="mt-3 flex min-h-24 flex-col gap-2 text-sm">
      <p
        v-for="(m, i) in msgs[who] ?? []"
        :key="i"
        class="max-w-[85%] rounded-2xl px-3 py-2"
        :class="
          m.from === 'me' ? 'self-end bg-brand text-ink' : 'border border-ink/10 bg-white text-ink'
        "
      >
        {{ m.text }}
      </p>
    </div>
    <form class="mt-3 flex gap-2" @submit.prevent="send">
      <label :for="`chat-${who}`" class="sr-only">Mensaje para {{ who }}</label>
      <input
        :id="`chat-${who}`"
        v-model="text"
        placeholder="Escribe un mensaje…"
        :class="inputCls"
      />
      <Button type="submit" size="sm" class="h-11">Enviar</Button>
    </form>
  </div>
</template>
