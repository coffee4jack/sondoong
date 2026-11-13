import { cn } from "../../lib/cn";
import { usePortalSettings } from "../../lib/usePortalSettings";

/**
 * Encabezado oscuro con esquinas redondeadas, igual que la app.
 * - `tabs`: [{ id, label }], `active`: id activo, `onTab(id)` al elegir una pestaña.
 * - `action`: contenido (nodo React) alineado a la derecha de la fila de pestañas.
 */
export default function PageHeader({ tabs = [], active, onTab, action }) {
  const settings = usePortalSettings();
  return (
    <header className="rounded-b-[32px] bg-ink px-5 py-6 text-white sm:px-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-mute text-xs font-bold text-ink">
            Logo
          </div>
          <div>
            <p className="text-sm text-mute">Bienvenido</p>
            <p className="text-xl font-bold">{settings.businessName} · {settings.branchName}</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <label htmlFor="portal-search" className="sr-only">
            Buscar
          </label>
          <input
            id="portal-search"
            placeholder="Buscar pedido, producto…"
            className="h-11 min-w-0 flex-1 rounded-full bg-white px-5 text-sm text-ink placeholder:text-ink/50 sm:w-80"
          />
          <button
            type="button"
            aria-label="3 notificaciones"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white font-bold text-ink"
          >
            3
          </button>
        </div>
      </div>

      {(tabs.length > 0 || action) && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={active === t.id}
              className={cn(
                "h-9 cursor-pointer rounded-full px-4 text-sm transition focus-visible:outline-2 focus-visible:outline-brand",
                active === t.id
                  ? "bg-brand font-bold text-ink"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              onClick={() => onTab?.(t.id)}
            >
              {t.label}
            </button>
          ))}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
    </header>
  );
}
