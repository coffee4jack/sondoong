import { Outlet, ScrollRestoration } from "react-router-dom";

export default function App() {
  return (
    <div className="font-sans antialiased">
      <Outlet />
      {/* Equivale al scrollBehavior del router de Vue: arriba en cada ruta nueva y respeta #anclas */}
      <ScrollRestoration />
    </div>
  );
}
