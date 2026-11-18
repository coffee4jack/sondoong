import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import { usePortalSettings } from "../../lib/usePortalSettings";
import { api } from "../../lib/api";

export default function PageHeader({ tabs = [], active, onTab, action }) {
  const settings = usePortalSettings();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const search = (value) => {
    setQuery(value);
    window.clearTimeout(timer.current);
    if (value.trim().length < 2) {
      setResults(null);
      setSearchError("");
      return;
    }
    timer.current = window.setTimeout(async () => {
      try {
        setResults(await api(`/search/?q=${encodeURIComponent(value.trim())}`));
        setSearchError("");
      } catch {
        setSearchError("No se pudo buscar. Revisa la conexión con el servidor.");
      }
    }, 250);
  };

  const hasResults = results && (results.products.length > 0 || results.orders.length > 0);

  return (
    <header className="relative z-20 rounded-b-3xl bg-ink px-5 py-5 text-white sm:px-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-sm font-bold text-ink">{settings.businessName.slice(0, 1)}</div>
          <div>
            <p className="text-xs text-white/60">Portal del comercio</p>
            <p className="text-lg font-bold">{settings.businessName} · {settings.branchName}</p>
          </div>
        </div>
        <div className="relative flex w-full items-center gap-3 sm:w-auto">
          <label htmlFor="portal-search" className="sr-only">Buscar productos y pedidos</label>
          <input
            id="portal-search"
            value={query}
            onChange={(event) => search(event.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim()) {
                event.preventDefault();
                navigate(`/portal/historial?q=${encodeURIComponent(query.trim())}`);
                setOpen(false);
              }
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="Buscar pedidos o productos…"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/55 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40 sm:w-80"
          />
          {open && query.trim().length >= 2 && (
            <div className="absolute right-0 top-12 z-50 max-h-96 w-full overflow-y-auto rounded-xl bg-white p-2 text-ink shadow-2xl sm:w-96">
              {searchError && <p role="alert" className="p-3 text-sm text-red-700">{searchError}</p>}
              {!searchError && !results && <p className="p-3 text-sm text-ink/60">Buscando…</p>}
              {!searchError && results && !hasResults && <p className="p-3 text-sm text-ink/60">No hay coincidencias.</p>}
              {results?.orders?.length > 0 && <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase text-ink/50">Pedidos</p>}
              {results?.orders?.map((order) => (
                <Link key={order.db_id} to={`/portal/historial?q=${encodeURIComponent(order.code)}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-ink/5">
                  <b>#{order.code}</b> · {order.status} · L {order.total}
                </Link>
              ))}
              {results?.products?.length > 0 && <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase text-ink/50">Productos</p>}
              {results?.products?.map((product) => (
                <Link key={product.id} to="/portal/catalogo" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-ink/5">
                  <b>{product.name}</b> · {product.category_name} · L {product.price}
                </Link>
              ))}
            </div>
          )}
          <Link to="/portal/reportes" title="Resumen de operación" aria-label="Abrir reportes" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sm font-bold transition hover:bg-white/20">↗</Link>
        </div>
      </div>
      {(tabs.length > 0 || action) && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" aria-pressed={active === tab.id} className={cn("h-9 cursor-pointer rounded-full px-4 text-sm transition focus-visible:outline-2 focus-visible:outline-brand", active === tab.id ? "bg-brand font-bold text-ink" : "bg-white/10 text-white hover:bg-white/20")} onClick={() => onTab?.(tab.id)}>
              {tab.label}
            </button>
          ))}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
    </header>
  );
}
