import { Link, NavLink, Outlet } from "react-router-dom";

const nav = [
  ["pedidos", "Pedidos"],
  ["catalogo", "Catálogo"],
  ["horarios", "Pausas y horarios"],
  ["historial", "Historial"],
  ["reportes", "Reportes"],
  ["liquidaciones", "Liquidaciones"],
  ["mensajes", "Mensajes"],
];

export default function PortalLayout() {
  return (
    <div className="flex min-h-screen bg-sand text-ink">
      {/* Barra lateral (escritorio) */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col rounded-r-[32px] bg-ink p-4 text-white lg:flex">
        <Link to="/portal" className="px-3.5 text-3xl font-bold tracking-tighter">Bolt</Link>
        <p className="px-3.5 pb-6 text-sm text-mute">Portal del comercio</p>
        <nav aria-label="Portal" className="flex flex-col gap-1">
          {nav.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/portal/${path}`}
              className={({ isActive }) =>
                `rounded-2xl px-3.5 py-2.5 text-[15px] transition ${
                  isActive ? "bg-brand font-bold text-ink" : "text-mute hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="mt-auto px-3.5 py-2 text-sm text-mute hover:text-white">← Volver al sitio</Link>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Navegación horizontal (móvil y tablet) */}
        <nav aria-label="Portal" className="flex gap-2 overflow-x-auto bg-ink px-4 py-3 lg:hidden">
          {nav.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/portal/${path}`}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-4 py-1.5 text-sm ${isActive ? "bg-brand font-bold text-ink" : "bg-white/10 text-white"}`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/" className="shrink-0 rounded-full px-4 py-1.5 text-sm text-mute">Sitio</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
