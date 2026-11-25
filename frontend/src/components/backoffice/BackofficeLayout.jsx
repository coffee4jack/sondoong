import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import { useAuth } from "../../lib/useAuth";

const nav = [
  ["/backoffice", "Resumen", true],
  ["/backoffice/comercios", "Comercios"],
  ["/backoffice/usuarios", "Usuarios"],
];

export default function BackofficeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const link = ({ isActive }) => cn("rounded-xl px-3.5 py-2.5 text-[15px] transition", isActive ? "bg-brand/15 font-bold text-ink" : "text-ink/65 hover:bg-ink/5 hover:text-ink");

  return (
    <div className="flex min-h-screen bg-[#fafbfb] text-ink">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink/10 bg-white p-5 lg:flex">
        <Link to="/backoffice" className="px-3.5 text-3xl font-bold tracking-tighter">Bolt<span className="text-brand">.</span></Link>
        <p className="px-3.5 pb-8 text-sm text-ink/60">Backoffice</p>
        <nav aria-label="Backoffice" className="flex flex-col gap-1">
          {nav.map(([to, label, end]) => <NavLink key={to} to={to} end={end} className={link}>{label}</NavLink>)}
        </nav>
        <div className="mt-auto space-y-1 text-sm">
          <p className="truncate px-3.5 text-ink/60">{user?.email}</p>
          <button type="button" className="w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-ink/70 transition hover:bg-ink/5" onClick={async () => { await logout(); navigate("/login"); }}>Cerrar sesión</button>
          <Link to="/" className="block px-3.5 py-2 text-ink/60 hover:text-ink">← Volver al sitio</Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <nav aria-label="Backoffice" className="flex items-center gap-2 overflow-x-auto border-b border-ink/10 bg-white px-4 py-3 lg:hidden">
          {nav.map(([to, label, end]) => <NavLink key={to} to={to} end={end} className={link}>{label}</NavLink>)}
          <button type="button" className="ml-auto cursor-pointer text-sm text-ink/70" onClick={async () => { await logout(); navigate("/login"); }}>Salir</button>
        </nav>
        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-9"><Outlet /></main>
      </div>
    </div>
  );
}
