import { useState } from "react";

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
    <section id="app" className="bg-[#0d0f0e] py-20 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Descarga nuestras apps
          </h2>
          <p className="mt-5 text-base text-white/60 sm:text-lg">
            Disponible para dispositivos iOS y Android.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
          {/* Teléfono con íconos */}
          <div
            className="relative mx-auto h-[320px] w-full max-w-[420px] overflow-hidden rounded-tl-[3rem] border-l-[14px] border-t-[14px] border-[#1f9d63] bg-black p-8"
            aria-hidden="true"
          >
            <div className="grid grid-cols-3 gap-5">
              {apps.map((a) => (
                <div key={a.name} className="text-center">
                  <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#1f9d63] text-sm font-extrabold leading-tight">
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
                  onClick={() => setActive(k)}
                  className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34D186] ${active === k
                      ? "border-[#2a8c5e] text-white"
                      : "border-transparent text-white/60 hover:text-white"
                    }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <h3 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">
              {t.title}
            </h3>
            <p className="mt-4 text-base text-white/60">{t.text}</p>
            <a
              href="#"
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-[#2a8c5e] px-6 text-sm font-semibold text-white transition hover:bg-[#31a06c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34D186]"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}