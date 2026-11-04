import { useMemo, useState } from "react";
import Button from "../../components/buttons/Button";
import { Body, Card, Chip, Field, PageHeader, inputCls } from "../../components/portal/ui";
import { branches, historyRows, statuses } from "../../data/portal";
import { money } from "../../lib/beep";

const tone = { Entregado: "brand", "En curso": "soft", Cancelado: "dark" };
const initial = { from: "", to: "", status: "", branch: "", min: "" };

export default function History() {
  const [f, setF] = useState(initial);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const rows = useMemo(
    () =>
      historyRows.filter(
        (r) =>
          (!f.from || r.date >= f.from) &&
          (!f.to || r.date <= f.to) &&
          (!f.status || r.status === f.status) &&
          (!f.branch || r.branch === f.branch) &&
          (!f.min || r.total >= Number(f.min))
      ),
    [f]
  );
  const total = rows.reduce((s, r) => s + (r.status === "Cancelado" ? 0 : r.total), 0);

  return (
    <>
      <PageHeader />
      <Body>
        <h2 className="text-2xl font-bold">Historial de pedidos</h2>
        <Card className="mt-4" as="form" onReset={() => setF(initial)} aria-label="Filtros">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Desde">
              <input type="date" value={f.from} onChange={set("from")} className={inputCls} />
            </Field>
            <Field label="Hasta">
              <input type="date" value={f.to} onChange={set("to")} className={inputCls} />
            </Field>
            <Field label="Estado">
              <select value={f.status} onChange={set("status")} className={inputCls}>
                <option value="">Todos</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Sucursal">
              <select value={f.branch} onChange={set("branch")} className={inputCls}>
                <option value="">Todas</option>
                {branches.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Total mínimo (L)">
              <input
                type="number"
                min="0"
                value={f.min}
                onChange={set("min")}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-sm text-ink/70">
              {rows.length} pedidos · ventas netas de cancelados {money(total)}
            </p>
            <div className="flex gap-2">
              <Button type="reset" size="sm" variant="outline">
                Limpiar
              </Button>
              <Button size="sm" variant="dark" onClick={() => window.print()}>
                Imprimir resumen
              </Button>
            </div>
          </div>
        </Card>

        <Card className="print-area mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-ink/65">
                {["Pedido", "Fecha", "Sucursal", "Estado", "Total"].map((h) => (
                  <th key={h} scope="col" className="px-2 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-ink/10">
                  <td className="px-2 py-3 font-bold">#{r.id}</td>
                  <td className="px-2 py-3">{r.date}</td>
                  <td className="px-2 py-3">{r.branch}</td>
                  <td className="px-2 py-3">
                    <Chip tone={tone[r.status]}>{r.status}</Chip>
                  </td>
                  <td className="px-2 py-3">{money(r.total)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-2 py-6 text-center text-ink/65">
                    Sin resultados con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </Body>
    </>
  );
}
