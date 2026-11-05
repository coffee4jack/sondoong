<script setup>
import { ref } from "vue";
import Button from "../../components/buttons/Button.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import Chip from "../../components/portal/Chip.vue";
import ChipButton from "../../components/portal/ChipButton.vue";
import Field from "../../components/portal/Field.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import Toggle from "../../components/portal/Toggle.vue";
import { inputCls } from "../../components/portal/ui";
import { initialExceptions, weeklyHours } from "../../data/portal";

const DURATIONS = ["30 min", "1 hora", "Hasta el cierre"];
const REASONS = ["Cocina saturada", "Falta de personal", "Mantenimiento", "Otro"];
const stamp = () => new Date().toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" });
const emptyDraft = () => ({ date: "", from: "10:00", to: "16:00", reason: "" });

const paused = ref(false);
const dur = ref(DURATIONS[1]);
const reason = ref("");
const error = ref("");
const exceptions = ref([...initialExceptions]);
const draft = ref(emptyDraft());
const log = ref([]);

const addLog = (text) => {
  log.value = [{ text, at: stamp() }, ...log.value];
};

const togglePause = (v) => {
  if (v && !reason.value.trim()) {
    error.value = "Indica el motivo de la pausa.";
    return;
  }
  error.value = "";
  paused.value = v;
  addLog(v ? `Pedidos pausados (${dur.value}) · ${reason.value}` : "Pedidos reanudados");
};

const addException = () => {
  const d = draft.value;
  exceptions.value = [...exceptions.value, { id: Date.now(), ...d }];
  addLog(`Horario excepcional ${d.date} (${d.from}–${d.to}) · ${d.reason || "sin motivo"}`);
  draft.value = emptyDraft();
};
</script>

<template>
  <PageHeader />
  <Body>
    <h2 class="text-2xl font-bold">Pausas y horarios</h2>
    <div class="mt-4 grid items-start gap-5 lg:grid-cols-2">
      <Card>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold">Pausar nuevos pedidos</h3>
          <Toggle :checked="paused" label="Pausar nuevos pedidos" @change="togglePause" />
        </div>
        <p class="mt-1 text-sm text-ink/65">
          {{
            paused
              ? "Tu comercio no recibe pedidos nuevos."
              : "Tu comercio está recibiendo pedidos."
          }}
        </p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <ChipButton v-for="d in DURATIONS" :key="d" :active="dur === d" @click="dur = d">
            {{ d }}
          </ChipButton>
        </div>
        <Field label="Motivo (obligatorio al pausar)" class="mt-3">
          <select v-model="reason" :class="inputCls">
            <option value="">Selecciona un motivo…</option>
            <option v-for="r in REASONS" :key="r" :value="r">{{ r }}</option>
          </select>
        </Field>
        <p v-if="error" role="alert" class="mt-2 text-sm font-bold">{{ error }}</p>

        <h3 class="mt-6 text-lg font-bold">Horario semanal</h3>
        <table class="mt-2 w-full text-sm">
          <tbody>
            <tr v-for="[d, h] in weeklyHours" :key="d" class="border-b border-ink/10">
              <th scope="row" class="py-2.5 pr-2 text-left font-normal text-ink/70">{{ d }}</th>
              <td class="py-2.5 text-right font-bold">{{ h }}</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 class="text-lg font-bold">Horarios excepcionales</h3>
        <ul class="mt-3 space-y-2">
          <li
            v-for="x in exceptions"
            :key="x.id"
            class="flex items-center justify-between gap-2 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm"
          >
            <span>
              {{ x.date }} · {{ x.from }}–{{ x.to }}
              <span class="block text-[13px] text-ink/65">{{ x.reason }}</span>
            </span>
            <Chip tone="brand">Activo</Chip>
          </li>
        </ul>
        <form class="mt-4 space-y-3" @submit.prevent="addException">
          <Field label="Fecha">
            <input v-model="draft.date" required type="date" :class="inputCls" />
          </Field>
          <div class="grid grid-cols-2 gap-3">
            <Field label="Desde">
              <input v-model="draft.from" type="time" :class="inputCls" />
            </Field>
            <Field label="Hasta">
              <input v-model="draft.to" type="time" :class="inputCls" />
            </Field>
          </div>
          <Field label="Motivo">
            <input v-model="draft.reason" required :class="inputCls" />
          </Field>
          <Button type="submit" variant="dark" class="w-full">Añadir horario</Button>
        </form>

        <h3 class="mt-6 text-lg font-bold">Registro de cambios</h3>
        <ul class="mt-2 space-y-1.5 text-sm" aria-live="polite">
          <li v-if="log.length === 0" class="text-ink/65">Aún no hay cambios.</li>
          <li v-for="(l, i) in log" :key="i">
            <span class="text-ink/65">{{ l.at }}</span> · {{ l.text }}
          </li>
        </ul>
      </Card>
    </div>
  </Body>
</template>
