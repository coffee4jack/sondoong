import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/buttons/Button";
import Card from "../../components/portal/Card";
import { STATUS_LABEL, statusBadge } from "../../components/backoffice/ui";
import { formatMoney } from "../../components/charts";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

const filters = [["", "Todos"], ["active", "Activos"], ["pending", "Por aprobar"], ["paused", "Pausados"], ["suspended", "Suspendidos"]];

export default function Merchants() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { selectMerchant } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setRows(await api(`/backoffice/merchants/${filter ? `?status=${filter}` : ""}`));
      setError("");
    } catch (err) {
      setError(`No se pudieron cargar los comercios: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (merchant, status) => {
    try {
      await api(`/backoffice/merchants/${merchant.id}/set_status/`, { method: "POST", body: { status } });
      await load();
    } catch (err) {
      setError(`No se pudo cambiar el estado: ${err.message}`);
    }
  };

  const manage = (merchant) => {
    selectMerchant({ id: merchant.id, name: merchant.name });
    navigate("/portal");
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-4xl font-bold">Comercios</h1><p className="mt-1 text-ink/65">Crea comercios y entra a gestionar cualquiera de ellos.</p></div>
        <Button to="/backoffice/comercios/nuevo">+ Nuevo comercio</Button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {filters.map(([id, label]) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={`h-9 cursor-pointer rounded-full border px-4 text-sm transition ${filter === id ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:bg-ink/5"}`}>{label}</button>)}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <Card className="mt-5 overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-[15px]">
          <thead className="text-sm text-ink/60"><tr><th className="p-4 font-normal">Comercio</th><th className="p-4 font-normal">Zona</th><th className="p-4 font-normal">Comisión</th><th className="p-4 font-normal">Hoy</th><th className="p-4 font-normal">Estado</th><th className="p-4"><span className="sr-only">Acciones</span></th></tr></thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-t border-ink/5">
                <td className="p-4"><Link to={`/backoffice/comercios/${m.id}`} className="font-bold hover:underline">{m.name}</Link><p className="text-sm text-ink/60">{m.owners.join(", ") || "Sin dueño"}</p></td>
                <td className="p-4">{m.zone || "—"}</td>
                <td className="p-4">{Number(m.commission_rate)}%</td>
                <td className="p-4">{m.orders_today} · {formatMoney(m.sales_today)}</td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(m.status)}`}>{STATUS_LABEL[m.status]}</span></td>
                <td className="p-4"><div className="flex justify-end gap-2">
                  {m.status === "pending" && <Button size="sm" onClick={() => setStatus(m, "active")}>Aprobar</Button>}
                  {m.status === "active" && <Button size="sm" variant="light" onClick={() => setStatus(m, "paused")}>Pausar</Button>}
                  {m.status === "paused" && <Button size="sm" variant="light" onClick={() => setStatus(m, "active")}>Reanudar</Button>}
                  {m.status !== "suspended" && <Button size="sm" variant="dark" onClick={() => manage(m)}>Gestionar</Button>}
                </div></td>
              </tr>
            ))}
            {!loading && rows.length === 0 && <tr><td colSpan={6} className="p-6 text-ink/60">No hay comercios con este filtro.</td></tr>}
          </tbody>
        </table>
      </Card>
    </>
  );
}
