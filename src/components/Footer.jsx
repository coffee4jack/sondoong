const cols = [
  { title: "Empresa", links: ["Acerca de", "Carreras", "Prensa", "Blog"] },
  { title: "Productos", links: ["Viajes", "Comida", "Scooters", "Bolt Business"] },
  { title: "Conducir", links: ["Ser conductor", "Socios de flota", "Requisitos"] },
  { title: "Ayuda", links: ["Soporte", "Seguridad", "Contacto", "Términos"] },
];

export default function Footer() {
  return (
    <footer className="bg-[#09090B] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <p className="text-3xl font-extrabold text-[#34D186]">Bolt</p>
            <p className="mt-3 text-sm text-white/50">Movilidad para todos.</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-4 font-semibold">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/60 transition hover:text-[#34D186]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Bolt Clone. Proyecto de demostración.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
