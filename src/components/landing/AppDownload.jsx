import { useState } from "react";
import { cn } from "../../lib/cn";

const tabs = {
  Viajes: {
    title: "La forma rápida y económica de viajar.",
    text: "Disponible para dispositivos iOS y Android.",
    cta: "Obtener Bolt",
  },
  Entregas: {
    title: "Tu comida y tus compras, en minutos.",
    text: "Disponible para dispositivos iOS y Android.",
    cta: "Obtener Bolt Food",
  },
};

const apps = [
  { name: "Bolt", label: "Bolt" },
  { name: "Bolt Food", label: "Bolt Food" },
  { name: "Bolt Courier", label: "Courier" },
];

export default function AppDownload() {
  const [active, setActive] = useState("Viajes");
  const t = tabs[active];

  return (
    <section id="app" className="bg-ink py-20 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Descarga nuestras apps</h2>
          <p className="mt-5 text-base text-white/60 sm:text-lg">
            Disponible para dispositivos iOS y Android.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
          {/* Teléfono con íconos */}
          <div
            className="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-tl-[3rem] border-l-[14px] border-t-[14px] border-brand bg-ink p-8"
            aria-hidden="true"
          >
            <div className="grid grid-cols-3 gap-5">
              {apps.map((a) => (
                <div key={a.name} className="text-center">
                  <div className="flex aspect-square items-center justify-center rounded-2xl bg-brand text-ink text-sm font-bold leading-tight">
                    {a.label}
                  </div>
                  <p className="mt-2 text-xs text-white/70">{a.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pestañas */}
          <div>
            <div role="tablist" className="flex gap-1 border-b border-white/10">
              {Object.keys(tabs).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={active === k}
                  className={cn(
                    "-mb-px border-b-2 px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand",
                    active === k
                      ? "border-brand text-white"
                      : "border-transparent text-white/60 hover:text-white"
                  )}
                  onClick={() => setActive(k)}
                >
                  {k}
                </button>
              ))}
            </div>

            <h3 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h3>
            <p className="mt-4 text-base text-white/60">{t.text}</p>
            <a
              href="#"
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-brand px-6 text-sm font-bold text-ink transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
