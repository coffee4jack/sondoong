import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { money } from "../../lib/beep";

/** Cifras del día en una franja minimalista (ventas, pedidos, ticket y cancelaciones). */
export default function TodayStrip() {
  const [today, setToday] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = () => api("/orders/summary/?period=today").then((data) => alive && setToday(data)).catch(() => {});
    load();
    const timer = window.setInterval(load, 30000);
    return () => { alive = false; window.clearInterval(timer); };
  }, []);

  if (!today) return null;
  const items = [
    ["Ventas hoy", money(Number(today.sales))],
    ["Pedidos", today.orders],
    ["Ticket promedio", money(Number(today.average_ticket))],
    ["Cancelados", today.cancelled],
  ];
  return (
    <dl aria-label="Resumen de hoy" className="mb-6 flex flex-wrap gap-x-12 gap-y-4">
      {items.map(([label, value]) => (
        <div key={label}><dt className="text-sm text-ink/60">{label}</dt><dd className="text-3xl font-bold">{value}</dd></div>
      ))}
    </dl>
  );
}
