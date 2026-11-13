import { useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import Button from "../buttons/Button";
import Card from "./Card";
import Chip from "./Chip";
import ChipButton from "./ChipButton";
import { inputCls } from "./ui";
import { cn } from "../../lib/cn";

const ETAS = [10, 15, 20, 30];
const REASONS = ["Sin ingredientes", "Cocina saturada", "Fuera de horario", "Otro"];

export default function OrderCard({
  o,
  now,
  selected = false,
  onSelect,
  onAccept,
  onReject,
  onAdvance,
}) {
  const [eta, setEta] = useState(15);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const elapsed = Math.max(0, Math.floor((now - o.enteredAt) / 60000));
  const late = elapsed > o.target;
  const pct = Math.min(100, (elapsed / o.target) * 100);
  const time = new Date(o.enteredAt).toLocaleTimeString("es-HN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const print = () => {
    // flushSync: asegura que el pedido seleccionado ya esté pintado antes de abrir la impresión
    flushSync(() => onSelect?.());
    window.print();
  };

  return (
    <Card className={cn("mt-3", selected && "ring-2 ring-brand")}>
      <button type="button" className="block w-full text-left" onClick={() => onSelect?.()}>
        <span className="flex items-center justify-between">
          <b>#{o.id}</b>
          <Chip tone={o.priority === "Alta" ? "dark" : "soft"}>Prioridad {o.priority}</Chip>
        </span>
        <span className="mt-1.5 block text-[13px] text-ink/65">
          Entró {time} · Objetivo {o.target} min · {late ? "Retrasado" : `${elapsed} min`}
        </span>
        <span className="mt-2.5 block h-1.5 rounded-full bg-ink/10">
          <span
            className={cn("block h-1.5 rounded-full", late ? "bg-ink" : "bg-brand")}
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className="mt-2.5 block text-sm">{o.items.join(" · ")}</span>
      </button>

      {o.status === "new" && (
        <div className="mt-3">
          <p className="text-[13px] text-ink/65">Tiempo estimado</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {ETAS.map((m) => (
              <ChipButton key={m} active={eta === m} onClick={() => setEta(m)}>
                {m} min
              </ChipButton>
            ))}
          </div>
          {rejecting && (
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              aria-label="Motivo del rechazo"
              className={cn(inputCls, "mt-2")}
            >
              <option value="">Motivo del rechazo…</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onAccept?.(o.id, eta)}>
              Aceptar
            </Button>
            {rejecting ? (
              <Button
                size="sm"
                variant="dark"
                className="flex-1"
                disabled={!reason}
                onClick={() => onReject?.(o.id, reason)}
              >
                Confirmar rechazo
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setRejecting(true)}
              >
                Rechazar
              </Button>
            )}
          </div>
        </div>
      )}

      {o.status === "preparing" && (
        <div className="mt-3">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onAdvance?.(o.id, "ready")}>
              Marcar listo
            </Button>
            <Button size="sm" variant="outline" onClick={print}>
              Imprimir
            </Button>
          </div>
          <Link to="/portal/catalogo" className="mt-2 inline-block text-[13px] underline">
            Actualizar disponibilidad
          </Link>
        </div>
      )}

      {o.status === "ready" && (
        <Button
          size="sm"
          variant="dark"
          className="mt-3 w-full"
          onClick={() => onAdvance?.(o.id, "delivered")}
        >
          Entregar a repartidor
        </Button>
      )}
    </Card>
  );
}
