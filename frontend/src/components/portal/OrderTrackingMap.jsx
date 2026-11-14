function mapEmbedUrl(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const delta = 0.012;
  const bounds = [lon - delta, lat - delta, lon + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bounds)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
}

export default function OrderTrackingMap({ location }) {
  if (!location) {
    return (
      <div className="mt-2 grid min-h-44 place-items-center rounded-xl bg-ink/5 p-5 text-center">
        <div>
          <span aria-hidden="true" className="text-3xl">📍</span>
          <p className="mt-2 text-sm font-bold">Esperando ubicación GPS</p>
          <p className="mt-1 text-xs text-ink/60">El mapa aparecerá cuando el repartidor comparta su posición.</p>
        </div>
      </div>
    );
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const mapUrl = mapEmbedUrl(latitude, longitude);
  const mapsLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-ink/10 bg-white">
      <iframe
        title="Mapa de ubicación GPS del repartidor"
        src={mapUrl}
        className="block h-56 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs">
        <div>
          <p className="font-bold">{latitude.toFixed(5)}, {longitude.toFixed(5)}</p>
          <p className="mt-1 text-ink/60">
            Actualizado {new Date(location.recorded_at).toLocaleString()}
            {location.accuracy_m != null ? ` · precisión ${location.accuracy_m} m` : ""}
          </p>
        </div>
        <a className="rounded-lg bg-brand px-3 py-2 font-bold text-ink hover:brightness-95" href={mapsLink} target="_blank" rel="noreferrer">
          Abrir mapa ↗
        </a>
      </div>
    </div>
  );
}
