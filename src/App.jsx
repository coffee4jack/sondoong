import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";

// El portal se carga solo cuando se entra a /portal
const PortalLayout = lazy(() => import("./components/portal/PortalLayout"));
const Orders = lazy(() => import("./pages/portal/Orders"));
const Catalog = lazy(() => import("./pages/portal/Catalog"));
const Schedule = lazy(() => import("./pages/portal/Schedule"));
const History = lazy(() => import("./pages/portal/History"));
const Reports = lazy(() => import("./pages/portal/Reports"));
const Settlements = lazy(() => import("./pages/portal/Settlements"));
const Messages = lazy(() => import("./pages/portal/Messages"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const Loading = () => (
  <div className="grid min-h-screen place-items-center bg-white text-ink/70" role="status">
    Cargando…
  </div>
);

const NotFound = () => (
  <div className="grid min-h-screen place-items-center bg-white p-6 text-center">
    <div>
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-3 text-ink/70">Esta página no existe.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-bold text-ink">
        Volver al inicio
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="font-sans antialiased">
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<Orders />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="horarios" element={<Schedule />} />
            <Route path="historial" element={<History />} />
            <Route path="reportes" element={<Reports />} />
            <Route path="liquidaciones" element={<Settlements />} />
            <Route path="mensajes" element={<Messages />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
