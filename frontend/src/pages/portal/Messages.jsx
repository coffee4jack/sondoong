import { useState } from "react";
import { Link } from "react-router-dom";
import Chat from "../../components/portal/Chat";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import PageHeader from "../../components/portal/PageHeader";
import { threads } from "../../data/portal";
import { cn } from "../../lib/cn";

export default function Messages() {
  const [id, setId] = useState(threads[0].id);
  const t = threads.find((x) => x.id === id) ?? threads[0];

  return (
    <>
      <PageHeader />
      <Body>
        <h2 className="text-2xl font-bold">Mensajes</h2>
        <div className="mt-4 grid items-start gap-5 lg:grid-cols-[340px_1fr]">
          <ul className="space-y-3" aria-label="Conversaciones">
            {threads.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={x.id === id}
                  className={cn(
                    "w-full rounded-[20px] bg-white p-4 text-left shadow-sm focus-visible:outline-2 focus-visible:outline-brand",
                    x.id === id && "ring-2 ring-brand"
                  )}
                  onClick={() => setId(x.id)}
                >
                  <span className="flex items-center justify-between">
                    <b>Pedido #{x.orderId}</b>
                    <Chip>{x.with}</Chip>
                  </span>
                  <span className="mt-1 block truncate text-sm text-ink/65">
                    {x.messages.at(-1).text}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">
                Pedido #{t.orderId} · {t.with}
              </h3>
              <Link to="/portal/pedidos" className="text-sm underline">
                Ver pedido
              </Link>
            </div>
            <div className="mt-3">
              <Chat key={t.id} storageKey={`portal-message-thread-${t.id}`} initial={{ [t.with]: t.messages }} />
            </div>
            <p className="mt-3 text-[13px] text-ink/65">
              La comunicación se limita al contexto del pedido. Los datos personales del cliente
              permanecen ocultos.
            </p>
          </Card>
        </div>
      </Body>
    </>
  );
}
