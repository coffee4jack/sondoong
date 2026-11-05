import { createRouter, createWebHistory } from "vue-router";
import Landing from "../pages/Landing.vue";

// El portal se carga solo cuando se entra a /portal (carga diferida)
const routes = [
  { path: "/", component: Landing },
  {
    path: "/portal",
    component: () => import("../components/portal/PortalLayout.vue"),
    children: [
      { path: "", redirect: "/portal/pedidos" },
      { path: "pedidos", component: () => import("../pages/portal/Orders.vue") },
      { path: "catalogo", component: () => import("../pages/portal/Catalog.vue") },
      { path: "horarios", component: () => import("../pages/portal/Schedule.vue") },
      { path: "historial", component: () => import("../pages/portal/History.vue") },
      { path: "reportes", component: () => import("../pages/portal/Reports.vue") },
      { path: "liquidaciones", component: () => import("../pages/portal/Settlements.vue") },
      { path: "mensajes", component: () => import("../pages/portal/Messages.vue") },
    ],
  },
  { path: "/:pathMatch(.*)*", component: () => import("../pages/NotFound.vue") },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  // Equivale al <ScrollToTop /> del proyecto React
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash };
    return { top: 0 };
  },
});
