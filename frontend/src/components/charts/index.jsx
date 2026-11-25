import { money } from "../../lib/beep";

const STATUS_LABELS = { new: "Nuevo", preparing: "En preparación", ready: "Listo", delivered: "Entregado", rejected: "Rechazado", cancelled: "Cancelado" };
const STATUS_COLORS = { new: "#3bb77e", preparing: "#f5b942", ready: "#4f8ef7", delivered: "#010f1c", rejected: "#e5484d", cancelled: "#9aa4ab" };
export const statusLabel = (status) => STATUS_LABELS[status] ?? status;

const GRID = "#e6eaec";
const MUTED = "#5f6b73";

/** Línea con área. `data` = filas; `x` e `y` = claves; `format` da formato al valor. */
export function LineChart({ data, x, y, format = (v) => v, label, height = 220 }) {
  const width = 640;
  const pad = { l: 8, r: 8, t: 12, b: 26 };
  const values = data.map((row) => Number(row[y]) || 0);
  const max = Math.max(1, ...values);
  const step = data.length > 1 ? (width - pad.l - pad.r) / (data.length - 1) : 0;
  const px = (i) => pad.l + i * step;
  const py = (v) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  const points = values.map((v, i) => `${px(i)},${py(v)}`);
  const area = points.length ? `M${px(0)},${height - pad.b} L${points.join(" L")} L${px(values.length - 1)},${height - pad.b} Z` : "";
  const ticks = [0, Math.floor((data.length - 1) / 2), data.length - 1].filter((i, n, arr) => i >= 0 && arr.indexOf(i) === n);
  const summary = `${label}: ${data.map((row, i) => `${row[x]} ${format(values[i])}`).join(", ")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={summary} className="h-auto w-full">
      {[0, 0.5, 1].map((f) => <line key={f} x1={pad.l} x2={width - pad.r} y1={py(max * f)} y2={py(max * f)} stroke={GRID} />)}
      <path d={area} fill="#3bb77e" opacity="0.14" />
      <polyline points={points.join(" ")} fill="none" stroke="#3bb77e" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => <circle key={data[i][x]} cx={px(i)} cy={py(v)} r="3.5" fill="#fff" stroke="#3bb77e" strokeWidth="2"><title>{`${data[i][x]}: ${format(v)}`}</title></circle>)}
      {ticks.map((i) => <text key={i} x={px(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} fontSize="12" fill={MUTED}>{String(data[i][x]).slice(5)}</text>)}
    </svg>
  );
}

/** Barras verticales. `tickEvery` muestra una etiqueta de cada N barras. */
export function BarChart({ data, x, y, format = (v) => v, label, height = 200, tickEvery = 1, highlight }) {
  const width = 640;
  const pad = { l: 4, r: 4, t: 10, b: 24 };
  const values = data.map((row) => Number(row[y]) || 0);
  const max = Math.max(1, ...values);
  const slot = (width - pad.l - pad.r) / Math.max(1, data.length);
  const summary = `${label}: ${data.map((row, i) => `${row[x]} ${format(values[i])}`).join(", ")}`;
  const peak = highlight ?? values.indexOf(Math.max(...values));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={summary} className="h-auto w-full">
      <line x1={pad.l} x2={width - pad.r} y1={height - pad.b} y2={height - pad.b} stroke={GRID} />
      {values.map((v, i) => {
        const h = (v / max) * (height - pad.t - pad.b);
        return (
          <g key={data[i][x]}>
            <rect x={pad.l + i * slot + slot * 0.15} y={height - pad.b - h} width={slot * 0.7} height={Math.max(v > 0 ? 2 : 0, h)} rx="4" fill={i === peak && v > 0 ? "#3bb77e" : "#c9ede0"}><title>{`${data[i][x]}: ${format(v)}`}</title></rect>
            {i % tickEvery === 0 && <text x={pad.l + i * slot + slot / 2} y={height - 7} textAnchor="middle" fontSize="11" fill={MUTED}>{data[i][x]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/** Dona con leyenda. `data` = [{ status, count }]. */
export function DonutChart({ data, label }) {
  const total = data.reduce((sum, row) => sum + row.count, 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const summary = `${label}: ${data.map((row) => `${statusLabel(row.status)} ${row.count}`).join(", ")}`;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" role="img" aria-label={summary} className="h-36 w-36 shrink-0">
        <circle cx="70" cy="70" r={radius} fill="none" stroke={GRID} strokeWidth="18" />
        {total > 0 && data.map((row) => {
          const length = (row.count / total) * circumference;
          const circle = <circle key={row.status} cx="70" cy="70" r={radius} fill="none" stroke={STATUS_COLORS[row.status] ?? "#9aa4ab"} strokeWidth="18" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)"><title>{`${statusLabel(row.status)}: ${row.count}`}</title></circle>;
          offset += length;
          return circle;
        })}
        <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="#010f1c">{total}</text>
        <text x="70" y="86" textAnchor="middle" fontSize="11" fill={MUTED}>pedidos</text>
      </svg>
      <ul className="min-w-40 flex-1 space-y-2 text-sm">
        {data.map((row) => (
          <li key={row.status} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[row.status] ?? "#9aa4ab" }} />{statusLabel(row.status)}</span>
            <b>{row.count}</b>
          </li>
        ))}
        {data.length === 0 && <li className="text-ink/60">Sin pedidos en el período.</li>}
      </ul>
    </div>
  );
}

/** Barras horizontales con nombre y valor (productos o comercios top). */
export function HBars({ rows, name = "name", value, format = (v) => v, empty = "Sin datos todavía." }) {
  const max = Math.max(1, ...rows.map((row) => Number(row[value]) || 0));
  if (rows.length === 0) return <p className="text-sm text-ink/60">{empty}</p>;
  return (
    <ol className="space-y-3">
      {rows.map((row) => (
        <li key={row[name]}>
          <div className="flex justify-between gap-3 text-sm"><span className="truncate">{row[name]}</span><b>{format(Number(row[value]) || 0)}</b></div>
          <div className="mt-1 h-2 rounded-full bg-ink/5"><div className="h-2 rounded-full bg-brand" style={{ width: `${((Number(row[value]) || 0) / max) * 100}%` }} /></div>
        </li>
      ))}
    </ol>
  );
}

export const formatMoney = (v) => money(Number(v) || 0);
