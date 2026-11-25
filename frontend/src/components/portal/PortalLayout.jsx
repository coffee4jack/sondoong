import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import { useAuth } from "../../lib/useAuth";
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

// El color de la barra lateral es configurable: se adapta el texto para que siempre se lea.
function isDarkColor(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!match) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function PortalLayout() {
  const settings = usePortalSettings();
  const { isAdmin, user, merchantName, logout } = useAuth();
  const navigate = useNavigate();
  const dark = isDarkColor(settings.sidebar);
  const theme = {
    "--portal-brand": settings.brand,
    "--portal-ink": settings.ink,
    "--portal-surface": settings.surface,
    "--portal-sidebar": settings.sidebar,
  };
  const muted = dark ? "text-white/65" : "text-ink/60";
  const hover = dark ? "hover:bg-white/10 hover:text-white" : "hover:bg-ink/5 hover:text-ink";
  const itemCls = ({ isActive }) =>
    cn("rounded-xl px-3.5 py-2.5 text-[15px] transition", isActive ? (dark ? "bg-brand font-bold text-ink" : "bg-brand/15 font-bold text-ink") : cn(muted, hover));
  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={cn("portal-theme flex min-h-screen bg-[#fafbfb] text-ink", settings.compact && "portal-compact")} style={theme}>
      <aside className={cn("sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-[var(--portal-sidebar)] p-5 lg:flex", dark ? "text-white" : "border-r border-ink/10 text-ink")}>
        <Link to="/portal" className="px-3.5 text-3xl font-bold tracking-tighter">
          Bolt<span className="text-brand">.</span>
        </Link>
        <p className={cn("px-3.5 pb-8 text-sm", muted)}>Portal del comercio</p>
        <nav aria-label="Portal" className="flex flex-col gap-1">
          {nav.map(([path, label]) => (
            <NavLink key={path} to={`/portal/${path}`} className={itemCls}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-1 text-sm">
          {merchantName && <p className={cn("truncate px-3.5 pb-1 font-bold")}>{merchantName}</p>}
          {user && <p className={cn("truncate px-3.5 pb-2", muted)}>{user.email}</p>}
          {isAdmin && <Link to="/backoffice/comercios" className={cn("block rounded-xl px-3.5 py-2.5", muted, hover)}>← Volver al backoffice</Link>}
          <Link to="/admin" className={cn("block rounded-xl px-3.5 py-2.5", muted, hover)}>⚙ Configurar portal</Link>
          <button type="button" onClick={signOut} className={cn("w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-left", muted, hover)}>Cerrar sesión</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <nav aria-label="Portal" className={cn("flex items-center gap-2 overflow-x-auto bg-[var(--portal-sidebar)] px-4 py-3 lg:hidden", !dark && "border-b border-ink/10")}>
          {nav.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/portal/${path}`}
              className={({ isActive }) => cn("shrink-0 rounded-full px-4 py-1.5 text-sm", isActive ? "bg-brand font-bold text-ink" : dark ? "bg-white/10 text-white" : "bg-ink/5 text-ink")}
            >
              {label}
            </NavLink>
          ))}
          <button type="button" onClick={signOut} className={cn("ml-auto shrink-0 cursor-pointer px-3 py-1.5 text-sm", muted)}>Salir</button>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
