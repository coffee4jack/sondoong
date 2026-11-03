import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import Chat from "../../components/portal/Chat";
import { Body, Card, Chip, ChipButton, PageHeader, Toggle, inputCls } from "../../components/portal/ui";
import { initialChats, initialOrders, makeOrder } from "../../data/portal";
import useNow from "../../hooks/useNow";
import { beep, money } from "../../lib/beep";

const COLUMNS = [["new", "Nuevos"], ["preparing", "En preparación"], ["ready", "Listos"]];
const ETAS = [10, 15, 20, 30];
const REASONS = ["Sin ingredientes", "Cocina saturada", "Fuera de horario", "Otro"];
const FORMATS = ["Ticket 80 mm", "A4", "Resumen"];

function OrderCard({ o, now, selected, onSelect, onAccept, onReject, onAdvance }) {
  const [eta, setEta] = useState(15);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const elapsed = Math.max(0, Math.floor((now - o.enteredAt) / 60000));
  const late = elapsed > o.target;
  const pct = Math.min(100, (elapsed / o.target) * 100);
  const time = new Date(o.enteredAt).toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" });

  return (
    <Card className={`mt-3 ${selected ? "ring-2 ring-brand" : ""}`}>
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <span className="flex items-center justify-between">
          <b>#{o.id}</b>
          <Chip tone={o.priority === "Alta" ? "dark" : "soft"}>Prioridad {o.priority}</Chip>
        </span>
        <span className="mt-1.5 block text-[13px] text-ink/65">
          Entró {time} · Objetivo {o.target} min · {late ? "Retrasado" : `${elapsed} min`}
        </span>
        <span className="mt-2.5 block h-1.5 rounded-full bg-ink/10">
          <span className={`block h-1.5 rounded-full ${late ? "bg-ink" : "bg-brand"}`} style={{ width: `${pct}%` }} />
        </span>
        <span className="mt-2.5 block text-sm">{o.items.join(" · ")}</span>
      </button>

      {o.status === "new" && (
        <div className="mt-3">
          <p className="text-[13px] text-ink/65">Tiempo estimado</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {ETAS.map((m) => (
              <ChipButton key={m} active={eta === m} onClick={() => setEta(m)}>{m} min</ChipButton>
            ))}
          </div>
          {rejecting && (
            <select aria-label="Motivo del rechazo" value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputCls} mt-2`}>
              <option value="">Motivo del rechazo…</option>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          )}
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onAccept(o.id, eta)}>Aceptar</Button>
            {rejecting ? (
              <Button size="sm" variant="dark" className="flex-1" disabled={!reason} onClick={() => onReject(o.id, reason)}>
                Confirmar rechazo
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setRejecting(true)}>Rechazar</Button>
            )}
          </div>
        </div>
      )}

      {o.status === "preparing" && (
        <div className="mt-3">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onAdvance(o.id, "ready")}>Marcar listo</Button>
            <Button size="sm" variant="outline" onClick={() => { onSelect(); window.print(); }}>Imprimir</Button>
          </div>
          <Link to="/portal/catalogo" className="mt-2 inline-block text-[13px] underline">Actualizar disponibilidad</Link>
        </div>
      )}

      {o.status === "ready" && (
        <Button size="sm" variant="dark" className="mt-3 w-full" onClick={() => onAdvance(o.id, "delivered")}>
          Entregar a repartidor
        </Button>
      )}
    </Card>
  );
}

export default function Orders() {
  const now = useNow(15000);
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(initialOrders[0].id);
  const [alertId, setAlertId] = useState(initialOrders[0].id);
  const [sound, setSound] = useState(true);
  const [format, setFormat] = useState(FORMATS[0]);
  const [notice, setNotice] = useState("");

  const active = orders.filter((o) => ["new", "preparing", "ready"].includes(o.status));
  const selected = active.find((o) => o.id === selectedId) ?? active[0];
  const alertOrder = active.find((o) => o.id === alertId && o.status === "new");

  const setStatus = (id, status, extra = {}) =>
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status, ...extra } : o)));

  const simulate = () => {
    const id = "A23" + Math.random().toString(36).slice(2, 6).toUpperCase();
    setOrders((os) => [makeOrder(id, ["1× Hamburguesa clásica"], 125, 0, 15, "Media"), ...os]);
    setAlertId(id);
    if (sound) beep();
  };

  const tabs = [
    { id: "all", label: "Todos" },
    ...COLUMNS.map(([id, label]) => ({ id, label: `${label} · ${active.filter((o) => o.status === id).length}` })),
  ];

  return (
    <>
      <PageHeader
        tabs={tabs}
        active={filter}
        onTab={setFilter}
        action={<Button size="sm" onClick={simulate}>Simular pedido nuevo</Button>}
      />
      <Body>
        <h2 className="sr-only">Panel de pedidos</h2>

        {alertOrder && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-brand px-5 py-4 text-ink">
            <div>
              <b>Nuevo pedido #{alertOrder.id}</b>
              <p className="text-sm">{sound ? "Alerta sonora activa" : "Alerta visual"} · requiere tu atención</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm">
                Sonido <Toggle checked={sound} onChange={setSound} label="Alerta sonora" />
              </span>
              <Button size="sm" variant="dark" onClick={() => setAlertId(null)}>Reconocer alerta</Button>
            </div>
          </div>
        )}
        {notice && <p role="status" className="mt-3 text-sm text-ink/70">{notice}</p>}

        <div className="mt-6 grid items-start gap-5 md:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_340px]">
          {COLUMNS.filter(([id]) => filter === "all" || filter === id).map(([id, label]) => (
            <section key={id} aria-label={label} className={filter === "all" ? "" : "md:col-span-3 xl:col-span-3"}>
              <h3 className="text-lg font-bold">{label}</h3>
              {active.filter((o) => o.status === id).map((o) => (
                <OrderCard
                  key={o.id}
                  o={o}
                  now={now}
                  selected={selected?.id === o.id}
                  onSelect={() => setSelectedId(o.id)}
                  onAccept={(oid, eta) => { setStatus(oid, "preparing", { target: eta }); setNotice(`Pedido #${oid} aceptado · ${eta} min estimados.`); }}
                  onReject={(oid, reason) => { setStatus(oid, "rejected"); setNotice(`Pedido #${oid} rechazado · motivo: ${reason}.`); }}
                  onAdvance={(oid, st) => { setStatus(oid, st); if (st === "delivered") setNotice(`Pedido #${oid} entregado al repartidor.`); }}
                />
              ))}
              {active.every((o) => o.status !== id) && <p className="mt-3 text-sm text-ink/65">Sin pedidos.</p>}
            </section>
          ))}

          {/* Detalle: impresión y comunicación */}
          {selected && (
            <Card as="aside" className="md:col-span-3 xl:col-span-1" aria-label="Detalle del pedido">
              <h3 className="text-lg font-bold">Pedido #{selected.id}</h3>
              <div className="print-area mt-3 rounded-2xl border border-dashed border-mute p-4 text-[13px]">
                <b>El Sabor · Centro</b>
                <p className="text-ink/65">Formato: {format}</p>
                <ul className="mt-3 space-y-0.5">{selected.items.map((i) => <li key={i}>{i}</li>)}</ul>
                <p className="mt-3 font-bold">Total {money(selected.total)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {FORMATS.map((f) => <ChipButton key={f} active={format === f} onClick={() => setFormat(f)}>{f}</ChipButton>)}
              </div>
              <Button className="mt-3 w-full" onClick={() => window.print()}>Imprimir orden</Button>

              <h3 className="mt-6 text-base font-bold">Comunicación</h3>
              <Chat key={selected.id} initial={initialChats} />
              <p className="mt-3 text-[13px] text-ink/65">Los datos personales del cliente permanecen ocultos.</p>
            </Card>
          )}
        </div>
      </Body>
    </>
  );
}
