import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import RequireAuth from "../components/RequireAuth";

// Carga diferida: el bundle de cada página del portal se descarga bajo demanda.
const page = (loader) => async () => ({ Component: (await loader()).default });

// React Router displays this fallback while resolving lazy routes at startup.
function RouterLoading() {
  return <div role="status" className="grid min-h-screen place-items-center text-ink">Cargando…</div>;
}

const router = createBrowserRouter([
  {
    element: <App />,
    HydrateFallback: RouterLoading,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/login", element: <Login /> },
      { path: "/admin", lazy: page(() => import("../pages/admin/Settings")) },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "/portal",
            lazy: page(() => import("../components/portal/PortalLayout")),
            children: [
              { index: true, element: <Navigate to="/portal/pedidos" replace /> },
              { path: "pedidos", lazy: page(() => import("../pages/portal/Orders")) },
              { path: "catalogo", lazy: page(() => import("../pages/portal/Catalog")) },
              { path: "horarios", lazy: page(() => import("../pages/portal/Schedule")) },
              { path: "historial", lazy: page(() => import("../pages/portal/History")) },
              { path: "reportes", lazy: page(() => import("../pages/portal/Reports")) },
              { path: "liquidaciones", lazy: page(() => import("../pages/portal/Settlements")) },
              { path: "mensajes", lazy: page(() => import("../pages/portal/Messages")) },
            ],
          },
        ],
      },
      {
        element: <RequireAuth admin />,
        children: [
          {
            path: "/backoffice",
            lazy: page(() => import("../components/backoffice/BackofficeLayout")),
            children: [
              { index: true, lazy: page(() => import("../pages/backoffice/Dashboard")) },
              { path: "comercios", lazy: page(() => import("../pages/backoffice/Merchants")) },
              { path: "comercios/nuevo", lazy: page(() => import("../pages/backoffice/MerchantForm")) },
              { path: "comercios/:id", lazy: page(() => import("../pages/backoffice/MerchantForm")) },
              { path: "usuarios", lazy: page(() => import("../pages/backoffice/Users")) },
            ],
          },
        ],
      },
      { path: "*", lazy: page(() => import("../pages/NotFound")) },
    ],
  },
]);

export default router;
