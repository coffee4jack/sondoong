import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Kpi from "../../components/portal/Kpi";
import PageHeader from "../../components/portal/PageHeader";
import { reportRanges } from "../../data/portal";
import { money } from "../../lib/beep";
import { cn } from "../../lib/cn";

const tabs = Object.keys(reportRanges).map((k) => ({ id: k, label: k }));

export default function Reports() {
  const [range, setRange] = useState("30 días");

  const r = reportRanges[range];
  const max = Math.max(...r.bars.map(([, v]) => v));
  const net = r.sales - r.commission;
  const chartLabel = `Ventas: ${r.bars.map(([l, v]) => `${l} ${money(v)}`).join(", ")}`;
  const print = () => window.print();

  return (
    <>
      <PageHeader
        tabs={tabs}
        active={range}
        onTab={setRange}
        action={
          <Button size="sm" onClick={print}>
            Imprimir resumen
          </Button>
        }
      />
      <Body>
        <div className="print-area">
          <h2 className="text-2xl font-bold">Reportes · {range}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Kpi label="Ventas" value={money(r.sales)} hint={`${r.orders} pedidos`} />
            <Kpi
              label="Cancelaciones"
              value={r.cancels}
              hint={`${((r.cancels / r.orders) * 100).toFixed(1)} % de los pedidos`}
            />
            <Kpi label="Tiempo de preparación" value={`${r.prep} min`} hint="Objetivo: 15 min" />
            <Kpi label="Valoración" value={`${r.rating} / 5`} hint={`${r.reviews} reseñas`} />
            <Kpi label="Comisiones" value={money(r.commission)} hint="20 % de las ventas" />
            <Kpi label="Importe neto estimado" value={money(net)} hint="Antes de ajustes" />
          </div>

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_340px]">
            <Card>
              <h3 className="text-lg font-bold">Ventas por periodo</h3>
              <div role="img" aria-label={chartLabel} className="mt-4 flex h-56 items-end gap-3">
                {r.bars.map(([label, v], i) => (
                  <div key={label} className="flex h-full flex-1 flex-col justify-end text-center">
                    <div
                      className={cn(
                        "rounded-t-xl",
                        i === r.bars.length - 1 ? "bg-brand" : "bg-ink/15"
                      )}
                      style={{ height: `${(v / max) * 85}%` }}
                    />
                    <span className="mt-2 text-xs text-ink/65">{label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold">Liquidaciones</h3>
              <p className="mt-2 text-sm text-ink/70">
                Consulta importes, ajustes y estado de cada periodo. Solo lectura.
              </p>
              <Button to="/portal/liquidaciones" variant="dark" className="mt-4 w-full">
                Ver liquidaciones
              </Button>
              <Link to="/portal/historial" className="mt-3 inline-block text-sm underline">
                Ir al historial de pedidos
              </Link>
            </Card>
          </div>
        </div>
      </Body>
    </>
  );
}
