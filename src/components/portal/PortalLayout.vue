<script setup>
const nav = [
  ["pedidos", "Pedidos"],
  ["catalogo", "Catálogo"],
  ["horarios", "Pausas y horarios"],
  ["historial", "Historial"],
  ["reportes", "Reportes"],
  ["liquidaciones", "Liquidaciones"],
  ["mensajes", "Mensajes"],
];
</script>

<template>
  <div class="flex min-h-screen bg-white text-ink">
    <!-- Barra lateral (escritorio) -->
    <aside
      class="sticky top-0 hidden h-screen w-56 shrink-0 flex-col rounded-r-[32px] bg-ink p-4 text-white lg:flex"
    >
      <RouterLink to="/portal" class="px-3.5 text-3xl font-bold tracking-tighter">Bolt</RouterLink>
      <p class="px-3.5 pb-6 text-sm text-mute">Portal del comercio</p>
      <nav aria-label="Portal" class="flex flex-col gap-1">
        <RouterLink
          v-for="[path, label] in nav"
          :key="path"
          v-slot="{ href, navigate, isActive }"
          :to="`/portal/${path}`"
          custom
        >
          <a
            :href="href"
            class="rounded-2xl px-3.5 py-2.5 text-[15px] transition"
            :class="isActive ? 'bg-brand font-bold text-ink' : 'text-mute hover:text-white'"
            @click="navigate"
          >
            {{ label }}
          </a>
        </RouterLink>
      </nav>
      <RouterLink to="/" class="mt-auto px-3.5 py-2 text-sm text-mute hover:text-white">
        ← Volver al sitio
      </RouterLink>
    </aside>

    <div class="min-w-0 flex-1">
      <!-- Navegación horizontal (móvil y tablet) -->
      <nav aria-label="Portal" class="flex gap-2 overflow-x-auto bg-ink px-4 py-3 lg:hidden">
        <RouterLink
          v-for="[path, label] in nav"
          :key="path"
          v-slot="{ href, navigate, isActive }"
          :to="`/portal/${path}`"
          custom
        >
          <a
            :href="href"
            class="shrink-0 rounded-full px-4 py-1.5 text-sm"
            :class="isActive ? 'bg-brand font-bold text-ink' : 'bg-white/10 text-white'"
            @click="navigate"
          >
            {{ label }}
          </a>
        </RouterLink>
        <RouterLink to="/" class="shrink-0 rounded-full px-4 py-1.5 text-sm text-mute">
          Sitio
        </RouterLink>
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>
