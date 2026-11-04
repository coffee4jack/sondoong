import { useState } from "react";
import Button from "../../components/buttons/Button";
import { Body, Card, Chip, PageHeader } from "../../components/portal/ui";
import { settlements } from "../../data/portal";
import { money } from "../../lib/beep";

const net = (s) => s.gross - s.commission + s.adjustments.reduce((a, [, v]) => a + v, 0);
const signed = (n) => (n < 0 ? `− ${money(-n)}` : `+ ${money(n)}`);

export default function Settlements() {
  const [id, setId] = useState(settlements[0].id);
  const s = settlements.find((x) => x.id === id) ?? settlements[0];

  return (
    <>
      <PageHeader
        action={
          <Button size="sm" onClick={() => window.print()}>
            Imprimir detalle
          </Button>
        }
      />
      <Body>
        <h2 className="text-2xl font-bold">Liquidaciones</h2>
        <div className="mt-4 grid items-start gap-5 lg:grid-cols-[340px_1fr]">
          <ul className="space-y-3" aria-label="Periodos">
            {settlements.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => setId(x.id)}
                  aria-pressed={x.id === id}
                  className={`w-full rounded-[20px] bg-white p-4 text-left shadow-sm focus-visible:outline-2 focus-visible:outline-brand ${x.id === id ? "ring-2 ring-brand" : ""}`}
                >
                  <span className="flex items-center justify-between">
                    <b>{x.period}</b>
                    <Chip tone={x.status === "Pagada" ? "brand" : "dark"}>{x.status}</Chip>
                  </span>
                  <span className="mt-1 block text-sm text-ink/65">Neto {money(net(x))}</span>
                </button>
              </li>
            ))}
          </ul>

          <Card className="print-area">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">{s.period}</h3>
              <Chip tone={s.status === "Pagada" ? "brand" : "dark"}>{s.status}</Chip>
            </div>
            <table className="mt-3 w-full text-sm">
              <tbody>
                <tr className="border-b border-ink/10">
                  <th scope="row" className="py-3 text-left font-normal">
                    Ventas brutas
                  </th>
                  <td className="py-3 text-right">{money(s.gross)}</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <th scope="row" className="py-3 text-left font-normal">
                    Comisión Bolt
                  </th>
                  <td className="py-3 text-right">{signed(-s.commission)}</td>
                </tr>
                {s.adjustments.map(([label, v]) => (
                  <tr key={label} className="border-b border-ink/10">
                    <th scope="row" className="py-3 text-left font-normal">
                      {label}
                    </th>
                    <td className="py-3 text-right">{signed(v)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="py-3 text-left">
                    Importe neto
                  </th>
                  <td className="py-3 text-right text-lg font-bold">{money(net(s))}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/75">
              Solo lectura: los importes los calcula el sistema financiero y no se pueden modificar
              desde el portal.
            </p>
          </Card>
        </div>
      </Body>
    </>
  );
}
