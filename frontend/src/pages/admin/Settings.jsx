import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import Card from "../../components/portal/Card";
import Field from "../../components/portal/Field";
import { inputCls } from "../../components/portal/ui";
import { DEFAULT_PORTAL_SETTINGS, readPortalSettings, savePortalSettings } from "../../lib/portalSettings";

const colorFields = [
  ["brand", "Color de acento"],
  ["ink", "Texto y color oscuro"],
  ["sidebar", "Barra lateral"],
  ["surface", "Fondo de tarjetas"],
];

export default function Settings() {
  const [settings, setSettings] = useState(readPortalSettings);
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = (event) => {
    event.preventDefault();
    savePortalSettings(settings);
    setSaved(true);
  };

  const reset = () => {
    setSettings({ ...DEFAULT_PORTAL_SETTINGS });
    savePortalSettings(DEFAULT_PORTAL_SETTINGS);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Administración</p>
            <h1 className="mt-1 text-3xl font-bold">Configuración del portal</h1>
            <p className="mt-2 text-slate-600">Estos ajustes afectan solo al portal, no a la landing page.</p>
          </div>
          <Link to="/portal" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-bold hover:bg-slate-100">
            ← Volver al portal
          </Link>
        </header>

        <form onSubmit={save} className="grid items-start gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <Card as="section">
              <h2 className="text-xl font-bold">Identidad del comercio</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Nombre del comercio">
                  <input className={inputCls} value={settings.businessName} onChange={(e) => update("businessName", e.target.value)} maxLength={80} />
                </Field>
                <Field label="Sucursal activa">
                  <input className={inputCls} value={settings.branchName} onChange={(e) => update("branchName", e.target.value)} maxLength={80} />
                </Field>
              </div>
            </Card>

            <Card as="section">
              <h2 className="text-xl font-bold">Apariencia del portal</h2>
              <p className="mt-1 text-sm text-slate-600">Selecciona un color o introduce su código hexadecimal.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {colorFields.map(([key, label]) => (
                  <Field key={key} label={label}>
                    <div className="flex gap-2">
                      <input aria-label={`${label}: selector de color`} type="color" value={settings[key]} onChange={(e) => update(key, e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" />
                      <input aria-label={`${label}: hexadecimal`} className={inputCls} value={settings[key]} pattern="^#[0-9A-Fa-f]{6}$" onChange={(e) => update(key, e.target.value)} />
                    </div>
                  </Field>
                ))}
              </div>
              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
                <input type="checkbox" checked={settings.compact} onChange={(e) => update("compact", e.target.checked)} className="h-4 w-4 accent-emerald-600" />
                <span><b className="block">Vista compacta</b><span className="text-sm text-slate-600">Reduce el espacio vertical en las páginas del portal.</span></span>
              </label>
            </Card>
          </div>

          <div className="space-y-4">
            <Card as="section">
              <h2 className="text-lg font-bold">Vista previa</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200" style={{ backgroundColor: settings.surface, color: settings.ink }}>
                <div className="px-4 py-3 text-white" style={{ backgroundColor: settings.sidebar }}>Barra lateral · Portal</div>
                <div className="p-4">
                  <p className="font-bold">{settings.businessName || "Nombre del comercio"}</p>
                  <p className="text-sm opacity-70">{settings.branchName || "Sucursal"}</p>
                  <button type="button" className="mt-3 rounded-full px-4 py-2 font-bold" style={{ backgroundColor: settings.brand, color: settings.ink }}>Botón de ejemplo</button>
                </div>
              </div>
            </Card>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" className="flex-1">Guardar configuración</Button>
              <Button type="button" variant="outline" onClick={reset}>Restaurar</Button>
            </div>
            {saved && <p role="status" className="text-sm font-bold text-emerald-800">Configuración guardada en este navegador.</p>}
            <p className="text-xs leading-5 text-slate-500">Las preferencias se guardan en el navegador actual. Para compartirlas con el equipo, se necesita persistencia en el backend.</p>
          </div>
        </form>
      </div>
    </main>
  );
}
