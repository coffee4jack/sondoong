import { useState } from "react";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import ChipButton from "../../components/portal/ChipButton";
import Field from "../../components/portal/Field";
import PageHeader from "../../components/portal/PageHeader";
import Toggle from "../../components/portal/Toggle";
import { inputCls } from "../../components/portal/ui";
import { initialExceptions, weeklyHours } from "../../data/portal";

const DURATIONS = ["30 min", "1 hora", "Hasta el cierre"];
const REASONS = ["Cocina saturada", "Falta de personal", "Mantenimiento", "Otro"];
const stamp = () => new Date().toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" });
const emptyDraft = () => ({ date: "", from: "10:00", to: "16:00", reason: "" });

export default function Schedule() {
  const [paused, setPaused] = useState(false);
  const [dur, setDur] = useState(DURATIONS[1]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [exceptions, setExceptions] = useState(() => [...initialExceptions]);
  const [draft, setDraft] = useState(emptyDraft);
  const [log, setLog] = useState([]);

  const addLog = (text) => setLog((l) => [{ text, at: stamp() }, ...l]);
  const setField = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  const togglePause = (v) => {
    if (v && !reason.trim()) {
      setError("Indica el motivo de la pausa.");
      return;
    }
    setError("");
    setPaused(v);
    addLog(v ? `Pedidos pausados (${dur}) · ${reason}` : "Pedidos reanudados");
  };

  const addException = (e) => {
    e.preventDefault();
    setExceptions((xs) => [...xs, { id: Date.now(), ...draft }]);
    addLog(
      `Horario excepcional ${draft.date} (${draft.from}–${draft.to}) · ${draft.reason || "sin motivo"}`
    );
    setDraft(emptyDraft());
  };

  return (
    <>
      <PageHeader />
      <Body>
        <h2 className="text-2xl font-bold">Pausas y horarios</h2>
        <div className="mt-4 grid items-start gap-5 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Pausar nuevos pedidos</h3>
              <Toggle checked={paused} label="Pausar nuevos pedidos" onChange={togglePause} />
            </div>
            <p className="mt-1 text-sm text-ink/65">
              {paused
                ? "Tu comercio no recibe pedidos nuevos."
                : "Tu comercio está recibiendo pedidos."}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DURATIONS.map((d) => (
                <ChipButton key={d} active={dur === d} onClick={() => setDur(d)}>
                  {d}
                </ChipButton>
              ))}
            </div>
            <Field label="Motivo (obligatorio al pausar)" className="mt-3">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={inputCls}
              >
                <option value="">Selecciona un motivo…</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            {error && (
              <p role="alert" className="mt-2 text-sm font-bold">
                {error}
              </p>
            )}

            <h3 className="mt-6 text-lg font-bold">Horario semanal</h3>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {weeklyHours.map(([d, h]) => (
                  <tr key={d} className="border-b border-ink/10">
                    <th scope="row" className="py-2.5 pr-2 text-left font-normal text-ink/70">
                      {d}
                    </th>
                    <td className="py-2.5 text-right font-bold">{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h3 className="text-lg font-bold">Horarios excepcionales</h3>
            <ul className="mt-3 space-y-2">
              {exceptions.map((x) => (
                <li
                  key={x.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm"
                >
                  <span>
                    {x.date} · {x.from}–{x.to}
                    <span className="block text-[13px] text-ink/65">{x.reason}</span>
                  </span>
                  <Chip tone="brand">Activo</Chip>
                </li>
              ))}
            </ul>
            <form className="mt-4 space-y-3" onSubmit={addException}>
              <Field label="Fecha">
                <input
                  value={draft.date}
                  onChange={setField("date")}
                  required
                  type="date"
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Desde">
                  <input
                    value={draft.from}
                    onChange={setField("from")}
                    type="time"
                    className={inputCls}
                  />
                </Field>
                <Field label="Hasta">
                  <input
                    value={draft.to}
                    onChange={setField("to")}
                    type="time"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Motivo">
                <input
                  value={draft.reason}
                  onChange={setField("reason")}
                  required
                  className={inputCls}
                />
              </Field>
              <Button type="submit" variant="dark" className="w-full">
                Añadir horario
              </Button>
            </form>

            <h3 className="mt-6 text-lg font-bold">Registro de cambios</h3>
            <ul className="mt-2 space-y-1.5 text-sm" aria-live="polite">
              {log.length === 0 && <li className="text-ink/65">Aún no hay cambios.</li>}
              {log.map((l, i) => (
                <li key={i}>
                  <span className="text-ink/65">{l.at}</span> · {l.text}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Body>
    </>
  );
}
