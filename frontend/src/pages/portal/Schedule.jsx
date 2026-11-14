import { useCallback, useEffect, useState } from "react";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import ChipButton from "../../components/portal/ChipButton";
import Field from "../../components/portal/Field";
import PageHeader from "../../components/portal/PageHeader";
import Toggle from "../../components/portal/Toggle";
import { inputCls } from "../../components/portal/ui";
import { api } from "../../lib/api";

const DURATIONS = ["30 min", "1 hora", "Hasta el cierre"];
const REASONS = ["Cocina saturada", "Falta de personal", "Mantenimiento", "Otro"];
const emptyDraft = () => ({ date: "", start_time: "10:00", end_time: "16:00", reason: "" });
const defaultHours = [
  { day: "Lun – Vie", open: "10:00", close: "22:00" },
  { day: "Sábado", open: "10:00", close: "23:00" },
  { day: "Domingo", open: "11:00", close: "20:00" },
];

export default function Schedule() {
  const [schedule, setSchedule] = useState({ paused: false, pause_reason: "", pause_duration: "1 hora", weekly_hours: defaultHours });
  const [exceptions, setExceptions] = useState([]);
  const [dur, setDur] = useState(DURATIONS[1]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const [state, rows] = await Promise.all([api("/schedule/"), api("/schedule-exceptions/")]);
      setSchedule(state);
      setExceptions(rows);
      setReason(state.pause_reason || "");
      setDur(state.pause_duration || DURATIONS[1]);
      setError("");
    } catch (err) {
      setError(`No se pudieron cargar los horarios: ${err.message}`);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateSchedule = async (patch) => {
    setSaving(true);
    try {
      const saved = await api("/schedule/default/", { method: "PATCH", body: JSON.stringify(patch) });
      setSchedule(saved);
      setNotice("Configuración guardada en la base de datos.");
      setError("");
    } catch (err) {
      setError(`No se pudo guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const togglePause = async (paused) => {
    if (paused && !reason.trim()) {
      setError("Indica el motivo de la pausa.");
      return;
    }
    await updateSchedule({ paused, pause_reason: paused ? reason : "", pause_duration: paused ? dur : "" });
  };

  const changeHours = (index, field, value) => {
    setSchedule((current) => ({ ...current, weekly_hours: current.weekly_hours.map((row, i) => i === index ? { ...row, [field]: value } : row) }));
  };

  const saveHours = () => updateSchedule({ weekly_hours: schedule.weekly_hours });

  const addException = async (event) => {
    event.preventDefault();
    try {
      const created = await api("/schedule-exceptions/", { method: "POST", body: JSON.stringify(draft) });
      setExceptions((rows) => [...rows, created]);
      setDraft(emptyDraft());
      setNotice("Horario especial guardado.");
      setError("");
    } catch (err) {
      setError(`No se pudo guardar el horario especial: ${err.message}`);
    }
  };

  const deleteException = async (id) => {
    try {
      await api(`/schedule-exceptions/${id}/`, { method: "DELETE" });
      setExceptions((rows) => rows.filter((row) => row.id !== id));
    } catch (err) {
      setError(`No se pudo eliminar: ${err.message}`);
    }
  };

  const setField = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }));

  return <>
    <PageHeader />
    <Body>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">Pausas y horarios</h2><p className="mt-1 text-sm text-ink/65">Los cambios se guardan y sincronizan con el equipo.</p></div><Chip tone={schedule.paused ? "dark" : "brand"}>{schedule.paused ? "Pedidos pausados" : "Recibiendo pedidos"}</Chip></div>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="mt-3 text-sm">{notice}</p>}
      <div className="mt-4 grid items-start gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-bold">Pausar nuevos pedidos</h3><Toggle checked={schedule.paused} label="Pausar nuevos pedidos" onChange={togglePause} /></div>
          <p className="mt-1 text-sm text-ink/65">{schedule.paused ? `Pausado: ${schedule.pause_reason} · ${schedule.pause_duration}` : "El comercio está recibiendo pedidos."}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{DURATIONS.map((item) => <ChipButton key={item} active={dur === item} onClick={() => setDur(item)}>{item}</ChipButton>)}</div>
          <Field label="Motivo de pausa" className="mt-3"><select value={reason} onChange={(event) => setReason(event.target.value)} className={inputCls}><option value="">Selecciona motivo…</option>{REASONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <h3 className="mt-6 text-lg font-bold">Horario semanal</h3>
          <div className="mt-2 space-y-2">{schedule.weekly_hours.map((row, index) => <div key={row.day} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 border-b border-ink/10 py-2"><b className="text-sm">{row.day}</b><input aria-label={`${row.day}: apertura`} type="time" value={row.open} onChange={(event) => changeHours(index, "open", event.target.value)} className={inputCls} /><input aria-label={`${row.day}: cierre`} type="time" value={row.close} onChange={(event) => changeHours(index, "close", event.target.value)} className={inputCls} /></div>)}</div>
          <Button className="mt-3 w-full" disabled={saving} onClick={saveHours}>Guardar horario semanal</Button>
        </Card>
        <Card>
          <h3 className="text-lg font-bold">Horarios excepcionales</h3>
          <ul className="mt-3 space-y-2">{exceptions.map((item) => <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-ink/10 px-3.5 py-2.5 text-sm"><span>{item.date} · {item.start_time}–{item.end_time}<span className="block text-[13px] text-ink/65">{item.reason}</span></span><Button size="sm" variant="outline" aria-label={`Eliminar horario ${item.date}`} onClick={() => deleteException(item.id)}>Eliminar</Button></li>)}</ul>
          {exceptions.length === 0 && <p className="mt-3 text-sm text-ink/60">No hay horarios especiales programados.</p>}
          <form className="mt-4 space-y-3" onSubmit={addException}><Field label="Fecha"><input value={draft.date} onChange={setField("date")} required type="date" className={inputCls} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Desde"><input value={draft.start_time} onChange={setField("start_time")} type="time" required className={inputCls} /></Field><Field label="Hasta"><input value={draft.end_time} onChange={setField("end_time")} type="time" required className={inputCls} /></Field></div><Field label="Motivo"><input value={draft.reason} onChange={setField("reason")} required className={inputCls} /></Field><Button type="submit" variant="dark" className="w-full">Añadir horario</Button></form>
        </Card>
      </div>
    </Body>
  </>;
}
