/* Piezas compartidas del portal: mismo estilo que la app móvil */

export const inputCls =
  "h-11 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-[15px] text-ink placeholder:text-ink/50 focus-visible:outline-2 focus-visible:outline-brand";

export const Card = ({ as: Tag = "div", className = "", children, ...rest }) => (
  <Tag
    className={`rounded-[20px] border border-ink/10 bg-white p-5 shadow-sm ${className}`}
    {...rest}
  >
    {children}
  </Tag>
);

const chipTones = {
  soft: "border border-ink/15 bg-white text-ink",
  dark: "bg-ink text-white",
  brand: "bg-brand text-ink",
  outline: "border border-mute text-ink",
};

export const Chip = ({ tone = "soft", className = "", children }) => (
  <span
    className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${chipTones[tone]} ${className}`}
  >
    {children}
  </span>
);

export const ChipButton = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={!!active}
    onClick={onClick}
    className={`rounded-full px-3.5 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-brand ${
      active
        ? "bg-ink font-bold text-white"
        : "border border-ink/15 bg-white text-ink hover:bg-ink/5"
    }`}
  >
    {children}
  </button>
);

export const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-[42px] shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
      checked ? "bg-brand" : "bg-mute"
    }`}
  >
    <span
      className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all ${
        checked ? "left-[21px]" : "left-[3px]"
      }`}
    />
  </button>
);

export const Field = ({ label, className = "", children }) => (
  <label className={`block text-sm text-ink/70 ${className}`}>
    {label}
    <span className="mt-1.5 block">{children}</span>
  </label>
);

export const Body = ({ children }) => <div className="px-5 py-6 sm:px-9">{children}</div>;

/** Encabezado oscuro con esquinas redondeadas, igual que la app. */
export function PageHeader({ tabs = [], active, onTab, action }) {
  return (
    <header className="rounded-b-[32px] bg-ink px-5 py-6 text-white sm:px-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-mute text-xs font-bold text-ink">
            Logo
          </div>
          <div>
            <p className="text-sm text-mute">Bienvenido</p>
            <p className="text-xl font-bold">Restaurante El Sabor · Sucursal Centro</p>
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
            className="grid h-11 w-11 place-items-center rounded-full bg-white font-bold text-ink"
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
              onClick={() => onTab(t.id)}
              aria-pressed={active === t.id}
              className={`h-9 rounded-full px-4 text-sm transition focus-visible:outline-2 focus-visible:outline-brand ${
                active === t.id
                  ? "bg-brand font-bold text-ink"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
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
