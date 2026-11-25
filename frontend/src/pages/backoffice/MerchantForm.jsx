import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/buttons/Button";
import Card from "../../components/portal/Card";
import { STATUS_LABEL, fieldCls } from "../../components/backoffice/ui";
import { api } from "../../lib/api";

const empty = { name: "", category: "", zone: "", address: "", phone: "", logo: "", commission_rate: "15", status: "pending", owner_email: "", owner_name: "" };

function Field({ id, label, children }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-bold">{label}</label>{children}</div>;
}

export default function MerchantForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);
  const [settle, setSettle] = useState({ period: "", date_from: "", date_to: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!id) return;
    api(`/backoffice/merchants/${id}/`).then((m) => setForm({ ...empty, ...m, commission_rate: String(Number(m.commission_rate)) })).catch((err) => setError(err.message));
  }, [id]);

  const bind = (key) => ({ id: key, value: form[key] ?? "", onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })), className: fieldCls });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { owners: _owners, orders_today: _o, sales_today: _s, slug: _slug, created_at: _c, ...payload } = form;
      if (id) {
        delete payload.owner_email;
        delete payload.owner_name;
        await api(`/backoffice/merchants/${id}/`, { method: "PATCH", body: payload });
        navigate("/backoffice/comercios");
      } else {
        if (!payload.owner_email) delete payload.owner_email;
        const result = await api("/backoffice/merchants/", { method: "POST", body: payload });
        setCreated(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const createSettlement = async (event) => {
    event.preventDefault();
    try {
      const row = await api(`/backoffice/merchants/${id}/settle/`, { method: "POST", body: settle });
      setNotice(`Liquidación creada: ${row.orders} pedidos entregados, bruto L ${Number(row.gross).toLocaleString("es-HN")}, comisión L ${Number(row.commission).toLocaleString("es-HN")}.`);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (created) {
    return (
      <Card className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold">Comercio creado</h1>
        <p className="mt-2 text-ink/70"><b>{created.name}</b> quedó {STATUS_LABEL[created.status].toLowerCase()}. Apruébalo desde la lista cuando esté listo.</p>
        {created.owner_temp_password && (
          <div role="status" className="mt-5 rounded-2xl bg-brand/15 p-4">
            <p className="text-sm">Contraseña temporal para <b>{created.owners[0]}</b> (se muestra una sola vez, compártela por un canal seguro):</p>
            <p className="mt-2 select-all font-mono text-xl font-bold">{created.owner_temp_password}</p>
          </div>
        )}
        <div className="mt-6 flex gap-3"><Button to="/backoffice/comercios">Ir a comercios</Button><Button variant="light" onClick={() => { setCreated(null); setForm(empty); }}>Crear otro</Button></div>
      </Card>
    );
  }

  return (
    <>
      <Link to="/backoffice/comercios" className="text-sm text-ink/60 hover:text-ink">← Comercios</Link>
      <h1 className="mt-2 text-4xl font-bold">{id ? "Editar comercio" : "Nuevo comercio"}</h1>
      <form onSubmit={submit} className="mt-6 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-bold">Datos del comercio</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Nombre"><input required maxLength={140} {...bind("name")} /></Field>
              <Field id="category" label="Categoría"><input {...bind("category")} /></Field>
              <Field id="zone" label="Zona"><input {...bind("zone")} /></Field>
              <Field id="phone" label="Teléfono"><input {...bind("phone")} /></Field>
              <div className="sm:col-span-2"><Field id="address" label="Dirección"><input {...bind("address")} /></Field></div>
              <div className="sm:col-span-2"><Field id="logo" label="Logo (URL)"><input type="url" {...bind("logo")} /></Field></div>
            </div>
          </Card>
          {!id && (
            <Card>
              <h2 className="text-lg font-bold">Dueño de la cuenta</h2>
              <p className="mt-1 text-sm text-ink/65">Se crea su acceso y se genera una contraseña temporal.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="owner_email" label="Correo"><input type="email" {...bind("owner_email")} /></Field>
                <Field id="owner_name" label="Nombre"><input {...bind("owner_name")} /></Field>
              </div>
            </Card>
          )}
        </div>
        <Card className="h-fit">
          <h2 className="text-lg font-bold">Condiciones</h2>
          <div className="mt-4 space-y-4">
            <Field id="commission_rate" label="Comisión (%)"><input type="number" min="0" max="100" step="0.5" required {...bind("commission_rate")} /></Field>
            <Field id="status" label="Estado"><select {...bind("status")}>{Object.entries(STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
          </div>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <Button type="submit" className="mt-6 w-full" disabled={saving}>{saving ? "Guardando…" : id ? "Guardar cambios" : "Crear comercio"}</Button>
        </Card>
      </form>
      {id && (
        <Card as="form" onSubmit={createSettlement} className="mt-5">
          <h2 className="text-lg font-bold">Generar liquidación</h2>
          <p className="mt-1 text-sm text-ink/65">Suma los pedidos entregados del rango y aplica la comisión del comercio.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Field id="period" label="Nombre del período"><input required className={fieldCls} id="period" value={settle.period} onChange={(e) => setSettle({ ...settle, period: e.target.value })} /></Field>
            <Field id="date_from" label="Desde"><input required type="date" className={fieldCls} id="date_from" value={settle.date_from} onChange={(e) => setSettle({ ...settle, date_from: e.target.value })} /></Field>
            <Field id="date_to" label="Hasta"><input required type="date" className={fieldCls} id="date_to" value={settle.date_to} onChange={(e) => setSettle({ ...settle, date_to: e.target.value })} /></Field>
            <div className="flex items-end"><Button type="submit" variant="dark" className="w-full">Generar</Button></div>
          </div>
          {notice && <p role="status" className="mt-3 text-sm text-[#0f5a3a]">{notice}</p>}
        </Card>
      )}
    </>
  );
}
