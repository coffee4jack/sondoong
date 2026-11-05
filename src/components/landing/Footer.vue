<script setup>
const columns = [
  {
    title: "Productos",
    links: ["Viajes", "Scooters", "Bicicletas eléctricas", "Autos compartidos", "Bolt Food"],
  },
  {
    title: "Gana dinero",
    links: [
      "Conductores Bolt",
      "Ganancias del conductor",
      "Repartidores Bolt",
      { label: "Portal del comercio", to: "/portal" },
      "Flotas",
    ],
  },
  {
    title: "Empresa",
    links: ["Sobre Bolt", "Misión de Bolt", "Liderazgo", "Noticias", "Carreras"],
  },
  {
    title: "Soporte",
    links: ["Pasajeros", "Conductores", "Bolt Food", "Centro de ayuda", "Contacto"],
  },
  {
    title: "Seguridad",
    links: ["Seguridad del pasajero", "Seguridad del conductor", "Seguridad en scooters"],
  },
  { title: "Ubicaciones", links: ["Nuestras ciudades", "Nuestros aeropuertos"] },
  { title: "Soluciones para ciudades", links: ["Nuestra misión", "Estaciones de carga"] },
];

// Normaliza cada enlace a { label, to }
const normalize = (l) => (typeof l === "string" ? { label: l, to: "#" } : l);

const linkCls = "text-sm text-mute transition hover:text-white";
const year = new Date().getFullYear();
</script>

<template>
  <footer class="bg-ink text-white">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <div class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7">
        <nav v-for="c in columns" :key="c.title" :aria-label="c.title">
          <h4 class="text-sm font-bold">{{ c.title }}</h4>
          <ul class="mt-5 space-y-4">
            <li v-for="l in c.links.map(normalize)" :key="l.label">
              <RouterLink v-if="l.to.startsWith('/')" :to="l.to" :class="linkCls">
                {{ l.label }}
              </RouterLink>
              <a v-else :href="l.to" :class="linkCls">{{ l.label }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between"
      >
        <p>© {{ year }} Bolt. Todos los derechos reservados.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white">Privacidad</a>
          <a href="#" class="hover:text-white">Términos</a>
          <a href="#" class="hover:text-white">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
