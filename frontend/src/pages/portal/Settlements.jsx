import { useEffect, useMemo, useState } from "react";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import PageHeader from "../../components/portal/PageHeader";
import { api } from "../../lib/api";
import { money } from "../../lib/beep";

const net = (settlement) => Number(settlement.gross) - Number(settlement.commission) + settlement.adjustments.reduce((sum, [, value]) => sum + Number(value), 0);
const signed = (value) => value < 0 ? `− ${money(-value)}` : `+ ${money(value)}`;

export default function Settlements() {
  const [rows, setRows] = useState([]);
  const [id, setId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api("/settlements/").then((data) => { setRows(data); setId((current) => current ?? data[0]?.id ?? null); }).catch((err) => setError(`No se pudieron cargar liquidaciones: ${err.message}`)).finally(() => setLoading(false));
  }, []);
  const selected = rows.find((row) => row.id === id) ?? rows[0];
  const summary = useMemo(() => rows.reduce((totals, row) => ({ gross: totals.gross + Number(row.gross), net: totals.net + net(row) }), { gross: 0, net: 0 }), [rows]);

  return <><PageHeader action={<Button size="sm" onClick={() => window.print()} disabled={!selected}>Imprimir detalle</Button>} /><Body><h2 className="text-2xl font-bold">Liquidaciones</h2><p className="mt-1 text-sm text-ink/65">Consulta de periodos guardados. Los valores son de referencia de desarrollo.</p>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{loading && <p role="status" className="mt-3">Cargando liquidaciones…</p>}<div className="mt-4 grid gap-4 sm:grid-cols-2"><Card><p className="text-sm text-ink/60">Ventas brutas de periodos</p><p className="mt-1 text-2xl font-bold">{money(summary.gross)}</p></Card><Card><p className="text-sm text-ink/60">Neto estimado</p><p className="mt-1 text-2xl font-bold">{money(summary.net)}</p></Card></div><div className="mt-5 grid items-start gap-5 lg:grid-cols-[340px_1fr]"><ul className="space-y-2" aria-label="Periodos de liquidación">{rows.map((row) => <li key={row.id}><button type="button" aria-pressed={row.id === id} className={`w-full rounded-xl p-4 text-left transition hover:bg-ink/5 ${row.id === id ? "bg-brand/20 ring-1 ring-brand" : "bg-white"}`} onClick={() => setId(row.id)}><span className="flex items-center justify-between gap-2"><b>{row.period}</b><Chip tone={row.status === "Pagada" ? "brand" : "dark"}>{row.status}</Chip></span><span className="mt-1 block text-sm text-ink/65">Neto {money(net(row))}</span></button></li>)}</ul>{selected ? <Card className="print-area"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-bold">{selected.period}</h3><Chip tone={selected.status === "Pagada" ? "brand" : "dark"}>{selected.status}</Chip></div><table className="mt-3 w-full text-sm"><tbody><tr className="border-b border-ink/10"><th scope="row" className="py-3 text-left font-normal">Ventas brutas</th><td className="py-3 text-right">{money(Number(selected.gross))}</td></tr><tr className="border-b border-ink/10"><th scope="row" className="py-3 text-left font-normal">Comisión</th><td className="py-3 text-right">{signed(-Number(selected.commission))}</td></tr>{selected.adjustments.map(([label, value]) => <tr key={label} className="border-b border-ink/10"><th scope="row" className="py-3 text-left font-normal">{label}</th><td className="py-3 text-right">{signed(Number(value))}</td></tr>)}<tr><th scope="row" className="py-3 text-left">Neto estimado</th><td className="py-3 text-right text-lg font-bold">{money(net(selected))}</td></tr></tbody></table><p className="mt-3 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink/70">Solo lectura. Los cierres financieros definitivos requieren conciliación externa.</p></Card> : !loading && <Card>No hay liquidaciones cargadas todavía.</Card>}</div></Body></>;
}
