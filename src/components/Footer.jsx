const columns = [
  { title: "Productos", links: ["Viajes", "Scooters", "Bicicletas eléctricas", "Autos compartidos", "Bolt Food"] },
  { title: "Gana dinero", links: ["Conductores Bolt", "Ganancias del conductor", "Repartidores Bolt", "Comercios", "Flotas"] },
  { title: "Empresa", links: ["Sobre Bolt", "Misión de Bolt", "Liderazgo", "Noticias", "Carreras"] },
  { title: "Soporte", links: ["Pasajeros", "Conductores", "Bolt Food", "Centro de ayuda", "Contacto"] },
  { title: "Seguridad", links: ["Seguridad del pasajero", "Seguridad del conductor", "Seguridad en scooters"] },
  { title: "Ubicaciones", links: ["Nuestras ciudades", "Nuestros aeropuertos"] },
  { title: "Soluciones para ciudades", links: ["Nuestra misión", "Estaciones de carga"] },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d0f0e] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <ul className="mt-5 space-y-4">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[#bfeccf] transition hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Bolt. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}