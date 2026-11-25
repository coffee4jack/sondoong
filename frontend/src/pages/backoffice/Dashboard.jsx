import { useEffect, useState } from "react";
import Card from "../../components/portal/Card";
import Kpi from "../../components/portal/Kpi";
import { DonutChart, HBars, LineChart, formatMoney } from "../../components/charts";
import { api } from "../../lib/api";

const periods = [["7d", "7 días"], ["14d", "14 días"], ["30d", "30 días"]];

export default function Dashboard() {
  const [period, setPeriod] = useState("14d");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api(`/backoffice/summary/?period=${period}`)
      .then((result) => alive && (setData(result), setError("")))
      .catch((err) => alive && setError(`No se pudo cargar el resumen: ${err.message}`));
    return () => { alive = false; };
  }, [period]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-4xl font-bold">Resumen</h1><p className="mt-1 text-ink/65">Actividad de todos los comercios.</p></div>
        <div className="flex gap-2" role="group" aria-label="Período">
          {periods.map(([id, label]) => <button key={id} type="button" aria-pressed={period === id} onClick={() => setPeriod(id)} className={`h-9 cursor-pointer rounded-full border px-4 text-sm transition ${period === id ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:bg-ink/5"}`}>{label}</button>)}
        </div>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {!data && !error && <p role="status" className="mt-6 text-ink/60">Cargando…</p>}
      {data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Comercios activos" value={data.merchants.active} hint={`${data.merchants.pending} por aprobar`} />
            <Kpi label="Pedidos" value={data.orders} hint="Incluye cancelados" />
            <Kpi label="Ventas" value={formatMoney(data.sales)} hint={`Ticket promedio ${formatMoney(data.average_ticket)}`} />
            <Kpi label="Comisión estimada" value={formatMoney(data.commission)} hint="Según la tasa de cada comercio" />
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[2fr_1fr]">
            <Card><h2 className="text-lg font-bold">Ventas por día</h2><div className="mt-4"><LineChart data={data.daily} x="date" y="sales" label="Ventas por día" format={formatMoney} /></div></Card>
            <Card><h2 className="text-lg font-bold">Estado de pedidos</h2><div className="mt-4"><DonutChart data={data.by_status} label="Pedidos por estado" /></div></Card>
          </div>
          <Card className="mt-5"><h2 className="text-lg font-bold">Comercios con más ventas</h2><div className="mt-4"><HBars rows={data.top_merchants} value="sales" format={formatMoney} empty="Aún no hay ventas en este período." /></div></Card>
        </>
      )}
    </>
  );
}
