import { useState } from "react";
import Button from "../../components/buttons/Button";
import Chat from "../../components/portal/Chat";
import OrderCard from "../../components/portal/OrderCard";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import ChipButton from "../../components/portal/ChipButton";
import PageHeader from "../../components/portal/PageHeader";
import Toggle from "../../components/portal/Toggle";
import { initialChats, initialOrders, makeOrder } from "../../data/portal";
import useNow from "../../hooks/useNow";
import { beep, money } from "../../lib/beep";

const COLUMNS = [
  ["new", "Nuevos"],
  ["preparing", "En preparación"],
  ["ready", "Listos"],
];
const FORMATS = ["Ticket 80 mm", "A4", "Resumen"];

export default function Orders() {
  const now = useNow(15000);
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(initialOrders[0].id);
  const [alertId, setAlertId] = useState(initialOrders[0].id);
  const [sound, setSound] = useState(true);
  const [format, setFormat] = useState(FORMATS[0]);
  const [notice, setNotice] = useState("");

  // Valores derivados (en Vue eran `computed`)
  const active = orders.filter((o) => ["new", "preparing", "ready"].includes(o.status));
  const selected = active.find((o) => o.id === selectedId) ?? active[0];
  const alertOrder = active.find((o) => o.id === alertId && o.status === "new");
  const visibleColumns = COLUMNS.filter(([id]) => filter === "all" || filter === id);
  const tabs = [
    { id: "all", label: "Todos" },
    ...COLUMNS.map(([id, label]) => ({
      id,
      label: `${label} · ${active.filter((o) => o.status === id).length}`,
    })),
  ];

  const setStatus = (id, status, extra = {}) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status, ...extra } : o)));
  };

  const simulate = () => {
    const id = "A23" + Math.random().toString(36).slice(2, 6).toUpperCase();
    setOrders((list) => [makeOrder(id, ["1× Hamburguesa clásica"], 125, 0, 15, "Media"), ...list]);
    setAlertId(id);
    if (sound) beep();
  };

  const accept = (oid, eta) => {
    setStatus(oid, "preparing", { target: eta });
    setNotice(`Pedido #${oid} aceptado · ${eta} min estimados.`);
  };
  const reject = (oid, reason) => {
    setStatus(oid, "rejected");
    setNotice(`Pedido #${oid} rechazado · motivo: ${reason}.`);
  };
  const advance = (oid, st) => {
    setStatus(oid, st);
    if (st === "delivered") setNotice(`Pedido #${oid} entregado al repartidor.`);
  };
  const print = () => window.print();

  return (
    <>
      <PageHeader
        tabs={tabs}
        active={filter}
        onTab={setFilter}
        action={
          <Button size="sm" onClick={simulate}>
            Simular pedido nuevo
          </Button>
        }
      />
      <Body>
        <h2 className="sr-only">Panel de pedidos</h2>

        {alertOrder && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-brand px-5 py-4 text-ink"
          >
            <div>
              <b>Nuevo pedido #{alertOrder.id}</b>
              <p className="text-sm">
                {sound ? "Alerta sonora activa" : "Alerta visual"} · requiere tu atención
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm">
                Sonido <Toggle checked={sound} label="Alerta sonora" onChange={setSound} />
              </span>
              <Button size="sm" variant="dark" onClick={() => setAlertId(null)}>
                Reconocer alerta
              </Button>
            </div>
          </div>
        )}
        {notice && (
          <p role="status" className="mt-3 text-sm text-ink/70">
            {notice}
          </p>
        )}

        <div className="mt-6 grid items-start gap-5 md:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_340px]">
          {visibleColumns.map(([id, label]) => (
            <section
              key={id}
              aria-label={label}
              className={filter === "all" ? "" : "md:col-span-3 xl:col-span-3"}
            >
              <h3 className="text-lg font-bold">{label}</h3>
              {active
                .filter((x) => x.status === id)
                .map((o) => (
                  <OrderCard
                    key={o.id}
                    o={o}
                    now={now}
                    selected={selected?.id === o.id}
                    onSelect={() => setSelectedId(o.id)}
                    onAccept={accept}
                    onReject={reject}
                    onAdvance={advance}
                  />
                ))}
              {active.every((o) => o.status !== id) && (
                <p className="mt-3 text-sm text-ink/65">Sin pedidos.</p>
              )}
            </section>
          ))}

          {/* Detalle: impresión y comunicación */}
          {selected && (
            <Card
              as="aside"
              className="md:col-span-3 xl:col-span-1"
              aria-label="Detalle del pedido"
            >
              <h3 className="text-lg font-bold">Pedido #{selected.id}</h3>
              <div className="print-area mt-3 rounded-2xl border border-dashed border-mute p-4 text-[13px]">
                <b>El Sabor · Centro</b>
                <p className="text-ink/65">Formato: {format}</p>
                <ul className="mt-3 space-y-0.5">
                  {selected.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <p className="mt-3 font-bold">Total {money(selected.total)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {FORMATS.map((f) => (
                  <ChipButton key={f} active={format === f} onClick={() => setFormat(f)}>
                    {f}
                  </ChipButton>
                ))}
              </div>
              <Button className="mt-3 w-full" onClick={print}>
                Imprimir orden
              </Button>

              <h3 className="mt-6 text-base font-bold">Comunicación</h3>
              <Chat key={selected.id} initial={initialChats} />
              <p className="mt-3 text-[13px] text-ink/65">
                Los datos personales del cliente permanecen ocultos.
              </p>
            </Card>
          )}
        </div>
      </Body>
    </>
  );
}
