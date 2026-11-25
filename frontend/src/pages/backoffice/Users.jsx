import { useCallback, useEffect, useState } from "react";
import Button from "../../components/buttons/Button";
import Card from "../../components/portal/Card";
import { ROLE_LABEL, fieldCls } from "../../components/backoffice/ui";
import { api } from "../../lib/api";

const blank = { email: "", name: "", merchant: "", role: "staff" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState(null);

  const load = useCallback(async () => {
    try {
      const [u, m] = await Promise.all([api("/backoffice/users/"), api("/backoffice/merchants/")]);
      setUsers(u);
      setMerchants(m);
      setError("");
    } catch (err) {
      setError(`No se pudieron cargar los usuarios: ${err.message}`);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (event) => {
    event.preventDefault();
    try {
      const row = await api("/backoffice/users/", { method: "POST", body: form });
      setSecret(row.temp_password ? { email: row.email, password: row.temp_password } : null);
      setForm(blank);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (user) => {
    try {
      await api(`/backoffice/users/${user.id}/`, { method: "PATCH", body: { is_active: !user.is_active } });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const reset = async (user) => {
    try {
      const row = await api(`/backoffice/users/${user.id}/reset_password/`, { method: "POST" });
      setSecret({ email: user.email, password: row.temp_password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Usuarios</h1>
      <p className="mt-1 text-ink/65">Cuentas de comercio y administradores.</p>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {secret && <div role="status" className="mt-4 rounded-2xl bg-brand/15 p-4 text-sm">Contraseña temporal de <b>{secret.email}</b> (solo se muestra ahora): <span className="select-all font-mono text-base font-bold">{secret.password}</span></div>}
      <Card as="form" onSubmit={create} className="mt-6">
        <h2 className="text-lg font-bold">Agregar usuario a un comercio</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input aria-label="Correo" type="email" required placeholder="Correo" className={fieldCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input aria-label="Nombre" placeholder="Nombre" className={fieldCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select aria-label="Comercio" required className={fieldCls} value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })}><option value="">Comercio…</option>{merchants.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
          <select aria-label="Rol" className={fieldCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{Object.entries(ROLE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <Button type="submit">Agregar</Button>
        </div>
      </Card>
      <Card className="mt-5 overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-[15px]">
          <thead className="text-sm text-ink/60"><tr><th className="p-4 font-normal">Usuario</th><th className="p-4 font-normal">Comercios y rol</th><th className="p-4 font-normal">Estado</th><th className="p-4"><span className="sr-only">Acciones</span></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-ink/5">
                <td className="p-4"><b>{u.email}</b>{u.is_admin && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-white">Admin</span>}<p className="text-sm text-ink/60">{u.name}</p></td>
                <td className="p-4">{u.memberships.map((m) => `${m.merchant} (${ROLE_LABEL[m.role]})`).join(", ") || "—"}</td>
                <td className="p-4">{u.is_active ? "Activo" : "Desactivado"}</td>
                <td className="p-4"><div className="flex justify-end gap-2"><Button size="sm" variant="light" onClick={() => reset(u)}>Restablecer clave</Button><Button size="sm" variant="light" onClick={() => toggle(u)}>{u.is_active ? "Desactivar" : "Activar"}</Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
