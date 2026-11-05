<script setup>
import { computed, ref } from "vue";
import Button from "../../components/buttons/Button.vue";
import Body from "../../components/portal/Body.vue";
import Card from "../../components/portal/Card.vue";
import Chip from "../../components/portal/Chip.vue";
import Field from "../../components/portal/Field.vue";
import PageHeader from "../../components/portal/PageHeader.vue";
import Toggle from "../../components/portal/Toggle.vue";
import { inputCls } from "../../components/portal/ui";
import { categories, initialProducts } from "../../data/portal";
import { money } from "../../lib/beep";

const empty = {
  id: null,
  name: "",
  category: categories[0],
  price: 0,
  stock: 0,
  available: true,
  options: [],
  image: "",
};

const products = ref([...initialProducts]);
const cat = ref("all");
const form = ref({ ...initialProducts[0] });
const opt = ref("");
const saved = ref("");

const list = computed(() =>
  cat.value === "all" ? products.value : products.value.filter((p) => p.category === cat.value)
);

const set = (k, v) => {
  saved.value = "";
  form.value = { ...form.value, [k]: v };
};

const toggle = (id, v) => {
  products.value = products.value.map((p) =>
    p.id === id ? { ...p, available: v && p.stock > 0 } : p
  );
};

const addOption = () => {
  const t = opt.value.trim();
  if (t && !form.value.options.includes(t)) set("options", [...form.value.options, t]);
  opt.value = "";
};

const select = (p) => {
  form.value = p;
  saved.value = "";
};

const newProduct = () => {
  form.value = { ...empty };
  saved.value = "";
};

const onImage = (e) => {
  const file = e.target.files[0];
  if (file) set("image", URL.createObjectURL(file));
};

const save = () => {
  const stock = Math.max(0, Number(form.value.stock) || 0);
  const item = {
    ...form.value,
    price: Math.max(0, Number(form.value.price) || 0),
    stock,
    available: stock > 0 && form.value.available,
  };
  if (item.id == null) {
    item.id = Date.now();
    products.value = [...products.value, item];
  } else {
    products.value = products.value.map((x) => (x.id === item.id ? item : x));
  }
  form.value = item;
  saved.value = "Cambios guardados.";
};

const tabs = [{ id: "all", label: "Todos" }, ...categories.map((c) => ({ id: c, label: c }))];
</script>

<template>
  <PageHeader :tabs="tabs" :active="cat" @tab="cat = $event">
    <template #action>
      <Button size="sm" @click="newProduct">+ Agregar producto</Button>
    </template>
  </PageHeader>
  <Body>
    <div class="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
      <section aria-label="Productos">
        <h2 class="text-2xl font-bold">Productos</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <Card v-for="p in list" :key="p.id" :class="{ 'ring-2 ring-brand': form.id === p.id }">
            <button type="button" class="block w-full text-left" @click="select(p)">
              <img
                v-if="p.image"
                :src="p.image"
                alt=""
                class="h-28 w-full rounded-2xl object-cover"
              />
              <span
                v-else
                class="grid h-28 place-items-center rounded-2xl border border-ink/10 bg-white text-xs uppercase tracking-wide text-ink/60"
              >
                Imagen
              </span>
              <b class="mt-2.5 block">{{ p.name }}</b>
              <span class="text-[13px] text-ink/65">
                {{ money(p.price) }} · {{ p.stock }} en stock
              </span>
            </button>
            <div class="mt-3 flex items-center justify-between">
              <Chip :tone="p.available ? 'brand' : 'dark'">
                {{ p.available ? "Disponible" : "Agotado" }}
              </Chip>
              <Toggle
                :checked="p.available"
                :label="`Disponibilidad de ${p.name}`"
                @change="(v) => toggle(p.id, v)"
              />
            </div>
          </Card>
        </div>
      </section>

      <Card as="form" aria-label="Editar producto" @submit.prevent="save">
        <h2 class="text-lg font-bold">
          {{ form.id == null ? "Nuevo producto" : "Editar producto" }}
        </h2>
        <div class="mt-3 space-y-3">
          <img
            v-if="form.image"
            :src="form.image"
            alt=""
            class="h-24 w-full rounded-2xl object-cover"
          />
          <Field label="Imagen">
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-white"
              @change="onImage"
            />
          </Field>
          <Field label="Nombre">
            <input
              required
              :value="form.name"
              :class="inputCls"
              @input="set('name', $event.target.value)"
            />
          </Field>
          <Field label="Categoría">
            <select
              :value="form.category"
              :class="inputCls"
              @change="set('category', $event.target.value)"
            >
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </Field>
          <div class="grid grid-cols-2 gap-3">
            <Field label="Precio (L)">
              <input
                type="number"
                min="0"
                :value="form.price"
                :class="inputCls"
                @input="set('price', $event.target.value)"
              />
            </Field>
            <Field label="Existencias">
              <input
                type="number"
                min="0"
                :value="form.stock"
                :class="inputCls"
                @input="set('stock', $event.target.value)"
              />
            </Field>
          </div>
          <div>
            <p class="text-sm text-ink/70">Opciones</p>
            <div class="mt-1.5 flex flex-wrap gap-1.5">
              <button
                v-for="o in form.options"
                :key="o"
                type="button"
                :aria-label="`Quitar ${o}`"
                @click="
                  set(
                    'options',
                    form.options.filter((x) => x !== o)
                  )
                "
              >
                <Chip tone="dark">{{ o }} ×</Chip>
              </button>
            </div>
            <div class="mt-2 flex gap-2">
              <input
                v-model="opt"
                aria-label="Nueva opción"
                placeholder="Ej. Extra queso +L 15"
                :class="inputCls"
              />
              <Button size="sm" variant="outline" class="h-11" @click="addOption">Añadir</Button>
            </div>
          </div>
          <p class="text-[13px] text-ink/65">Los cambios aplican según los permisos de tu rol.</p>
          <Button type="submit" class="w-full">Guardar cambios</Button>
          <p v-if="saved" role="status" class="text-sm">{{ saved }}</p>
        </div>
      </Card>
    </div>
  </Body>
</template>
