import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../components/buttons/Button";
import Chat from "../../components/portal/Chat";
import OrderCard from "../../components/portal/OrderCard";
import OrderTrackingMap from "../../components/portal/OrderTrackingMap";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import PageHeader from "../../components/portal/PageHeader";
import Toggle from "../../components/portal/Toggle";
import { initialChats } from "../../data/portal";
import useNow from "../../hooks/useNow";
import { api } from "../../lib/api";
import { beep, money } from "../../lib/beep";

const COLUMNS = [["new", "Nuevos"], ["preparing", "En preparación"], ["ready", "Listos"]];
const FORMATS = ["Ticket 80 mm", "A4", "Resumen"];
const toOrder = (order) => ({ ...order, id: order.code ?? order.id, target: order.target ?? 15, enteredAt: new Date(order.enteredAt ?? order.entered_at).getTime(), total: Number(order.total) });

export default function Orders() {
  const now = useNow(15000);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [alertId, setAlertId] = useState(null);
  const [sound, setSound] = useState(true);
  const [format, setFormat] = useState(FORMATS[0]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);
  const gpsWatch = useRef(null);

  const load = useCallback(async () => {
    try {
      const rows = await api("/orders/");
      const mapped = rows.map(toOrder);
      setOrders(mapped);
      setSelectedId((current) => current ?? mapped[0]?.id ?? null);
      setAlertId((current) => current ?? mapped.find((item) => item.status === "new")?.id ?? null);
      setError("");
    } catch (err) {
      setError(`No se pudieron cargar pedidos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 12000);
    return () => window.clearInterval(timer);
  }, [load]);

  const active = orders.filter((order) => ["new", "preparing", "ready"].includes(order.status));
  const selected = active.find((order) => order.id === selectedId) ?? active[0];
  const alertOrder = active.find((order) => order.id === alertId && order.status === "new");
  const visibleColumns = COLUMNS.filter(([id]) => filter === "all" || filter === id);
  const tabs = [{ id: "all", label: "Todos" }, ...COLUMNS.map(([id, label]) => ({ id, label: `${label} · ${active.filter((order) => order.status === id).length}` }))];

  const updateOrder = async (id, patch, message) => {
    const order = orders.find((item) => item.id === id);
    if (!order?.db_id) return;
    try {
      const saved = await api(`/orders/${order.db_id}/`, { method: "PATCH", body: JSON.stringify(patch) });
      const mapped = toOrder(saved);
      setOrders((rows) => rows.map((item) => item.id === id ? mapped : item));
      setNotice(message);
      setError("");
    } catch (err) {
      setError(`No se pudo actualizar el pedido: ${err.message}`);
    }
  };

  const simulate = async () => {
    try {
      const created = await api("/orders/", {
        method: "POST",
        body: JSON.stringify({ code: `D${Date.now().toString().slice(-7)}`, items: ["1× Hamburguesa clásica"], total: 125, status: "new", priority: "Media", target: 15, branch: "Centro" }),
      });
      const order = toOrder(created);
      setOrders((rows) => [order, ...rows]);
      setSelectedId(order.id);
      setAlertId(order.id);
      if (sound) beep();
      setNotice(`Pedido de prueba #${order.id} guardado en MySQL.`);
    } catch (err) {
      setError(`No se pudo crear el pedido: ${err.message}`);
    }
  };

  const accept = (id, eta) => updateOrder(id, { status: "preparing", target: eta }, `Pedido #${id} aceptado · ${eta} min estimados.`);
  const reject = (id, reason) => updateOrder(id, { status: "rejected", rejection_reason: reason }, `Pedido #${id} rechazado · ${reason}.`);
  const advance = (id, status) => updateOrder(id, { status }, status === "delivered" ? `Pedido #${id} entregado al repartidor.` : `Pedido #${id} marcado listo.`);

  const shareCourierLocation = (order) => {
    if (!navigator.geolocation) {
      setError("Este navegador no ofrece geolocalización.");
      return;
    }
    if (gpsWatch.current !== null) {
      navigator.geolocation.clearWatch(gpsWatch.current);
      gpsWatch.current = null;
      setGpsActive(false);
      setNotice("Seguimiento GPS detenido.");
      return;
    }
    gpsWatch.current = navigator.geolocation.watchPosition(async ({ coords }) => {
      try {
        await api(`/orders/${order.db_id}/location/`, {
          method: "POST",
          body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude, accuracy_m: Math.round(coords.accuracy) }),
        });
        await load();
        setNotice(`GPS compartido para #${order.id} · precisión ${Math.round(coords.accuracy)} m.`);
      } catch (err) {
        setError(`No se pudo actualizar GPS: ${err.message}`);
      }
    }, (err) => setError(`No se obtuvo permiso/posición GPS: ${err.message}`), { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 });
    setGpsActive(true);
    setNotice(`Seguimiento GPS activo para #${order.id}.`);
  };

  useEffect(() => () => {
    if (gpsWatch.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(gpsWatch.current);
  }, []);

  return (
    <>
      <PageHeader tabs={tabs} active={filter} onTab={setFilter} action={<Button size="sm" onClick={simulate}>+ Pedido de prueba</Button>} />
      <Body>
        <h2 className="sr-only">Panel de pedidos</h2>
        {loading && <p role="status">Cargando pedidos…</p>}
        {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mb-3 text-sm text-ink/70">{notice}</p>}
        {alertOrder && <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-4 text-ink"><div><b>Nuevo pedido #{alertOrder.id}</b><p className="text-sm">Requiere tu atención.</p></div><div className="flex items-center gap-3 text-sm">Sonido<Toggle checked={sound} label="Alerta sonora" onChange={setSound} /><Button size="sm" variant="dark" onClick={() => setAlertId(null)}>Reconocer</Button></div></div>}
        <div className="grid items-start gap-5 md:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_340px]">
          {visibleColumns.map(([id, label]) => <section key={id} aria-label={label} className={filter === "all" ? "" : "md:col-span-3 xl:col-span-3"}><h3 className="text-lg font-bold">{label}</h3>{active.filter((order) => order.status === id).map((order) => <OrderCard key={order.id} o={order} now={now} selected={selected?.id === order.id} onSelect={() => setSelectedId(order.id)} onAccept={accept} onReject={reject} onAdvance={advance} />)}{!active.some((order) => order.status === id) && <p className="mt-3 text-sm text-ink/65">Sin pedidos.</p>}</section>)}
          {selected && <Card as="aside" className="md:col-span-3 xl:col-span-1" aria-label="Detalle del pedido"><h3 className="text-lg font-bold">Pedido #{selected.id}</h3><div className="print-area mt-3 rounded-2xl border border-dashed border-mute p-4 text-[13px]"><b>El Sabor · {selected.branch}</b><p className="text-ink/65">Formato: {format}</p><ul className="mt-3 space-y-0.5">{selected.items.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-3 font-bold">Total {money(selected.total)}</p></div><div className="mt-3 flex flex-wrap gap-1.5">{FORMATS.map((item) => <Button key={item} size="sm" variant={format === item ? "dark" : "outline"} onClick={() => setFormat(item)}>{item}</Button>)}</div><Button className="mt-3 w-full" onClick={() => window.print()}>Imprimir orden</Button><h3 className="mt-5 text-base font-bold">Ubicación del repartidor</h3><OrderTrackingMap location={selected.latest_location} /><Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => shareCourierLocation(selected)}>{gpsActive ? "Detener seguimiento GPS" : "Iniciar seguimiento GPS"}</Button><p className="mt-1 text-xs text-ink/50">En producción, esta acción debe ejecutarse desde la app/dispositivo del repartidor.</p><h3 className="mt-5 text-base font-bold">Comunicación</h3><Chat key={selected.id} storageKey={`portal-order-chat-${selected.id}`} initial={initialChats} /></Card>}
        </div>
      </Body>
    </>
  );
}
