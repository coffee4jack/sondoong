import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/cn";
import { usePortalSettings } from "../../lib/usePortalSettings";

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
  const settings = usePortalSettings();
  const theme = {
    "--portal-brand": settings.brand,
    "--portal-ink": settings.ink,
    "--portal-surface": settings.surface,
    "--portal-sidebar": settings.sidebar,
  };

  return (
    <div className={cn("portal-theme flex min-h-screen bg-white text-ink", settings.compact && "portal-compact")} style={theme}>
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-[var(--portal-sidebar)] p-4 text-white lg:flex">
        <Link to="/portal" className="px-3.5 text-3xl font-bold tracking-tighter">
          Bolt
        </Link>
        <p className="px-3.5 pb-6 text-sm text-mute">Portal del comercio</p>
        <nav aria-label="Portal" className="flex flex-col gap-1">
          {nav.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/portal/${path}`}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3.5 py-2.5 text-[15px] transition", 
                  isActive ? "bg-brand font-bold text-ink" : "text-mute hover:bg-white/10 hover:text-white"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/admin" className="mb-2 mt-auto rounded-lg px-3.5 py-2.5 text-sm transition-colors hover:bg-white/10">
          ⚙ Configurar portal
        </Link>
        <Link to="/" className="px-3.5 py-2 text-sm text-mute hover:text-white">
          ← Volver al sitio
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <nav aria-label="Portal" className="flex gap-2 overflow-x-auto bg-[var(--portal-sidebar)] px-4 py-3 lg:hidden">
          {nav.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/portal/${path}`}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm",
                  isActive ? "bg-brand font-bold text-ink" : "bg-white/10 text-white"
                )
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/admin" className="shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            Ajustes
          </Link>
          <Link to="/" className="shrink-0 rounded-full px-4 py-1.5 text-sm text-mute">
            Sitio
          </Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
