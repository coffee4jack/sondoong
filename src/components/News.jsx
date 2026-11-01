const featured = {
    tag: "Vida en Bolt",
    date: "28 oct 2026",
    title: "La IA nos ahorró 55 días de ingeniería. También nos mostró nuevas formas de fallar.",
    text: "Cómo los ingenieros de Bolt ahorraron más de 55 días con IA, detectaron identificaciones falsificadas y mejoraron la automatización del soporte.",
    img: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
};

const list = [
    {
        title: "Métropole du Grand Paris, Bolt y Stellantis se unen para llevar...",
        date: "23 oct 2026",
        img: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    },
    {
        title: "Bolt elige NVIDIA Alpamayo para impulsar sus vehículos autónomos...",
        date: "22 oct 2026",
        img: "https://images.pexels.com/photos/5988831/pexels-photo-5988831.jpeg",
    },
    {
        title: "Escalando pipelines de GitHub Actions",
        date: "19 oct 2026",
        img: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg",
    },
];

export default function News() {
    return (
        <section id="noticias" className="bg-[#f7f9f8] py-20">
            <div className="mx-auto max-w-6xl px-5">
                <h2 className="text-4xl font-extrabold tracking-tight text-[#0f1f17] sm:text-5xl">
                    Noticias y novedades
                </h2>
                <a
                    href="#"
                    className="mt-8 inline-flex h-12 items-center gap-3 rounded-xl bg-[#2a8c5e] px-6 text-sm font-semibold text-white transition hover:bg-[#31a06c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a8c5e]"
                >
                    Ver todo <span aria-hidden="true">↗</span>
                </a>

                <div className="mt-12 grid gap-6 lg:grid-cols-[1.9fr_1fr]">
                    {/* Destacada */}
                    <a
                        href="#"
                        className="grid overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-md sm:grid-cols-[0.9fr_1.1fr]"
                    >
                        <img
                            src={featured.img}
                            alt=""
                            loading="lazy"
                            className="h-56 w-full object-cover sm:h-full"
                        />
                        <div className="p-6 sm:p-7">
                            <div className="flex items-center justify-between text-sm">
                                <span className="rounded-full border border-[#2a8c5e] px-2.5 py-0.5 text-xs font-semibold text-[#2a8c5e]">
                                    {featured.tag}
                                </span>
                                <span className="text-black/60">{featured.date}</span>
                            </div>
                            <h3 className="mt-5 text-xl font-bold leading-snug tracking-tight text-[#0f1f17] sm:text-2xl">
                                {featured.title}
                            </h3>
                            <p className="mt-4 text-base leading-relaxed text-black/60">
                                {featured.text}
                            </p>
                        </div>
                    </a>

                    {/* Lista */}
                    <ul className="divide-y divide-black/10 rounded-2xl border border-black/10 bg-white px-4">
                        {list.map((n) => (
                            <li key={n.title}>
                                <a href="#" className="flex items-center gap-4 py-4 hover:opacity-80">
                                    <img
                                        src={n.img}
                                        alt=""
                                        loading="lazy"
                                        className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold leading-snug text-[#0f1f17]">
                                            {n.title}
                                        </p>
                                        <p className="mt-1 text-sm text-black/60">{n.date}</p>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}