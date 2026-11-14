import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import Field from "../../components/portal/Field";
import PageHeader from "../../components/portal/PageHeader";
import { inputCls } from "../../components/portal/ui";
import { api } from "../../lib/api";
import { money } from "../../lib/beep";

const statuses = [["", "Todos"], ["delivered", "Entregado"], ["new", "Nuevo"], ["preparing", "En preparación"], ["ready", "Listo"], ["rejected", "Rechazado"], ["cancelled", "Cancelado"]];
const tone = { delivered: "brand", new: "soft", preparing: "soft", ready: "brand", rejected: "dark", cancelled: "dark" };
const labels = Object.fromEntries(statuses);
const initial = { from: "", to: "", status: "", branch: "", min: "" };
const dateOf = (value) => value ? new Date(value).toLocaleDateString("en-CA") : "";

export default function History() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({ ...initial, q: searchParams.get("q") || "" }));
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { setFilters((current) => ({ ...current, q: searchParams.get("q") || "" })); }, [searchParams]);

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.q) query.set("search", filters.q);
    if (filters.status) query.set("status", filters.status);
    if (filters.branch) query.set("branch", filters.branch);
    if (filters.from) query.set("from", filters.from);
    if (filters.to) query.set("to", filters.to);
    if (filters.min) query.set("min", filters.min);
    setLoading(true);
    api(`/orders/?${query.toString()}`).then(setOrders).catch((err) => setError(`No se pudo cargar el historial: ${err.message}`)).finally(() => setLoading(false));
  }, [filters]);

  const total = useMemo(() => orders.filter((order) => !["rejected", "cancelled"].includes(order.status)).reduce((sum, order) => sum + Number(order.total), 0), [orders]);
  const setField = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  const reset = () => setFilters({ ...initial, q: "" });

  return <><PageHeader /><Body><h2 className="text-2xl font-bold">Historial de pedidos</h2><Card className="mt-4" as="form" aria-label="Filtros de pedidos" onSubmit={(event) => event.preventDefault()}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"><Field label="Buscar pedido"><input value={filters.q} onChange={setField("q")} className={inputCls} placeholder="Código o artículo" /></Field><Field label="Desde"><input value={filters.from} onChange={setField("from")} type="date" className={inputCls} /></Field><Field label="Hasta"><input value={filters.to} onChange={setField("to")} type="date" className={inputCls} /></Field><Field label="Estado"><select value={filters.status} onChange={setField("status")} className={inputCls}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Sucursal"><input value={filters.branch} onChange={setField("branch")} className={inputCls} placeholder="Todas" /></Field><Field label="Total mínimo (L)"><input value={filters.min} onChange={setField("min")} type="number" min="0" className={inputCls} /></Field></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-ink/70">{loading ? "Consultando…" : `${orders.length} pedidos · ventas no canceladas ${money(total)}`}</p><div className="flex gap-2"><Button size="sm" variant="outline" onClick={reset}>Limpiar</Button><Button size="sm" variant="dark" onClick={() => window.print()}>Imprimir</Button></div></div>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</Card><Card className="print-area mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead><tr className="text-left text-xs uppercase text-ink/65">{["Pedido", "Fecha", "Sucursal", "Estado", "Artículos", "Total"].map((heading) => <th key={heading} scope="col" className="px-2 py-3">{heading}</th>)}</tr></thead><tbody>{orders.map((order) => <tr key={order.db_id ?? order.id} className="border-t border-ink/10"><td className="px-2 py-3 font-bold">#{order.code ?? order.id}</td><td className="px-2 py-3">{dateOf(order.enteredAt)}</td><td className="px-2 py-3">{order.branch}</td><td className="px-2 py-3"><Chip tone={tone[order.status] ?? "soft"}>{labels[order.status] ?? order.status}</Chip></td><td className="max-w-64 truncate px-2 py-3">{order.items.join(" · ")}</td><td className="px-2 py-3">{money(Number(order.total))}</td></tr>)}{!loading && orders.length === 0 && <tr><td colSpan={6} className="px-2 py-6 text-center text-ink/65">No hay pedidos que coincidan con los filtros.</td></tr>}</tbody></table></Card></Body></>;
}
