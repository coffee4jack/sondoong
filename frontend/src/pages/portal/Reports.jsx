import { useEffect, useState } from "react";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Kpi from "../../components/portal/Kpi";
import PageHeader from "../../components/portal/PageHeader";
import { BarChart, DonutChart, HBars, LineChart } from "../../components/charts";
import { api } from "../../lib/api";
import { money } from "../../lib/beep";

const ranges = [["today", "Hoy"], ["7d", "7 días"], ["30d", "30 días"]];

export default function Reports() {
  const [period, setPeriod] = useState("30d");
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api(`/orders/summary/?period=${period}`).then(setSummary).catch((err) => setError(`No se pudieron cargar reportes: ${err.message}`)).finally(() => setLoading(false));
  }, [period]);
  useEffect(() => {
    api(`/orders/analytics/?period=${period}`).then(setInsights).catch(() => setInsights(null));
  }, [period]);

  const rows = summary?.daily_sales ?? [];
  const max = Math.max(1, ...rows.map((row) => Number(row.sales)));
  const chartLabel = rows.map((row) => `${row.date}: ${money(Number(row.sales))}`).join(", ");

  return <><PageHeader tabs={ranges.map(([id, label]) => ({ id, label }))} active={period} onTab={setPeriod} action={<Button size="sm" onClick={() => window.print()}>Imprimir resumen</Button>} /><Body><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Reportes · {ranges.find(([id]) => id === period)?.[1]}</h2>{loading && <span role="status" className="text-sm text-ink/60">Actualizando…</span>}</div>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{summary && <div className="print-area"><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi label="Ventas no canceladas" value={money(Number(summary.sales))} hint="Desde pedidos guardados" /><Kpi label="Pedidos" value={summary.orders} hint="Incluye cancelados" /><Kpi label="Cancelaciones" value={summary.cancelled} hint="Rechazados y cancelados" /><Kpi label="Ticket promedio" value={money(Number(summary.average_ticket))} hint="Por pedido no cancelado" /></div><Card className="mt-5"><h3 className="text-lg font-bold">Ventas por día</h3><div role="img" aria-label={`Ventas por día: ${chartLabel}`} className="mt-4 flex h-64 items-end gap-1 overflow-x-auto sm:gap-2">{rows.map((row) => <div key={row.date} title={`${row.date}: ${money(Number(row.sales))} · ${row.orders} pedidos`} className="flex h-full min-w-6 flex-1 flex-col justify-end text-center"><div className="rounded-t-lg bg-brand transition-all" style={{ height: `${Math.max(Number(row.sales) > 0 ? 4 : 0, (Number(row.sales) / max) * 85)}%` }} /><span className="mt-2 text-[10px] text-ink/60">{row.date.slice(5)}</span></div>)}</div></Card><Card className="mt-5"><h3 className="text-lg font-bold">Tendencia de ventas</h3><div className="mt-4"><LineChart data={rows} x="date" y="sales" label="Tendencia de ventas" format={(v) => money(Number(v))} /></div></Card>{insights && <div className="mt-5 grid gap-5 lg:grid-cols-2"><Card><h3 className="text-lg font-bold">Pedidos por hora</h3><p className="text-sm text-ink/60">Las horas pico, en verde intenso.</p><div className="mt-4"><BarChart data={insights.by_hour} x="hour" y="orders" label="Pedidos por hora" tickEvery={3} /></div></Card><Card><h3 className="text-lg font-bold">Estado de pedidos</h3><div className="mt-4"><DonutChart data={insights.by_status} label="Pedidos por estado" /></div></Card><Card className="lg:col-span-2"><h3 className="text-lg font-bold">Productos más pedidos</h3><div className="mt-4"><HBars rows={insights.top_products} value="quantity" format={(v) => `${v} u.`} /></div></Card></div>}</div>}<p className="mt-4 text-xs text-ink/55">Los importes se calculan con los pedidos actuales de MySQL. Para un cierre contable, usa los registros conciliados.</p></Body></>;
}
