import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Datos del menú ---------- */
const menu = {
  Products: [
    ["Rides", "Rider safety", "Become a driver", "Bolt Send"],
    ["Scooters", "Scooter safety", "Report an issue", "Safety lab"],
    ["Bolt Market", "Become a courier", "Add a restaurant or store"],
    ["Bolt Food", "Become a courier", "Add a restaurant or store", "Grocery Delivery"],
    ["Bolt Drive", "FAQ", "Report a vehicle"],
    ["Bolt for Business", "Benefits", "Work profile", "Products", "Bolt Food for Business"],
    ["E-bikes", "Safety lab", "Report an issue", "FAQ"],
    ["Bolt Plus", "Benefits", "How to join", "FAQ"],
  ],
  "Earn with Bolt": [
    ["Become a driver", "Requirements", "Earnings", "FAQ"],
    ["Become a courier", "Requirements", "Weekly payments", "FAQ"],
    ["Fleet owners", "Sign up", "Fleet tools", "FAQ"],
    ["Restaurants & stores", "Add your business", "Bolt Food for Business"],
  ],
  Company: [
    ["About Bolt", "Our story", "Press", "Blog"],
    ["Careers", "Open roles", "Life at Bolt", "Students"],
    ["Investors", "Reports", "Sustainability"],
    ["Contact", "Media kit", "Partnerships"],
  ],
  Safety: [
    ["Rider safety", "Driver safety", "Courier safety"],
    ["Scooter safety", "E-bike safety", "Safety lab"],
    ["Community guidelines", "Report an issue", "Emergency help"],
  ],
  Support: [
    ["Help center", "Riders", "Drivers", "Couriers"],
    ["Bolt Food", "Scooters", "Bolt Drive", "Bolt Plus"],
    ["Contact us", "Report an issue", "Lost items"],
  ],
  Cities: [
    ["Europe", "Tallinn", "Warsaw", "Lisbon", "Prague"],
    ["Africa", "Lagos", "Nairobi", "Cape Town", "Accra"],
    ["Latin America", "Mexico City", "Bogotá", "Lima"],
    ["Asia & Middle East", "Riyadh", "Dubai", "Tbilisi"],
  ],
};

const tabs = Object.keys(menu);

/* ---------- Iconos ---------- */
const Svg = ({ children, className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Globe = () => (
  <Svg className="h-3.5 w-3.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
  </Svg>
);

const Chevron = () => (
  <Svg className="h-4 w-4">
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

const side = [
  {
    title: "Become a driver",
    text: "Make money on your terms",
    color: "text-[#3B4BDB]",
    icon: (
      <Svg>
        <circle cx="12" cy="7" r="3.5" />
        <path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5z" />
      </Svg>
    ),
  },
  {
    title: "Become a courier",
    text: "Deliver food and get paid weekly",
    color: "text-[#2A8C5A]",
    icon: (
      <Svg>
        <circle cx="6" cy="17" r="3" />
        <circle cx="18" cy="17" r="3" />
        <path d="M6 17l4-8h5l3 8M10 9H8" />
      </Svg>
    ),
  },
  {
    title: "Add a restaurant or store",
    text: "Reach more customers and increase earnings",
    color: "text-[#2A8C5A]",
    icon: (
      <Svg>
        <path d="M7 3v8M4 3v5a3 3 0 006 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10" />
      </Svg>
    ),
  },
  {
    title: "Sign up as a fleet owner",
    text: "Add your fleet to Bolt and boost your income",
    color: "text-[#2A8C5A]",
    icon: (
      <Svg>
        <path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 13h.01M17 13h.01" />
      </Svg>
    ),
  },
  {
    title: "Bolt for Business",
    text: "Bolt products and services scaled-up for your business",
    color: "text-[#2A8C5A]",
    icon: (
      <Svg>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V4h6v3M3 13h18" />
      </Svg>
    ),
  },
];

const socials = [
  <Svg key="fb" className="h-[18px] w-[18px]">
    <circle cx="12" cy="12" r="9" />
    <path d="M13.5 20v-7h2.5M10.5 13h3M13.5 13c0-3 0-4 2.5-4" />
  </Svg>,
  <Svg key="x" className="h-[18px] w-[18px]">
    <path d="M4 4l16 16M20 4L4 20" />
  </Svg>,
  <Svg key="ig" className="h-[18px] w-[18px]">
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M16.5 7.5h.01" />
  </Svg>,
  <Svg key="in" className="h-[18px] w-[18px]">
    <path d="M6 10v8M6 6.5v.01M10 18v-8M10 13c0-2 1.5-3 3-3s3 1 3 3v5" />
  </Svg>,
  <Svg key="tt" className="h-[18px] w-[18px]">
    <path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5M14 4c.4 2.2 1.8 3.6 4 4" />
  </Svg>,
];

/* ---------- Logo ---------- */
const Logo = () => (
  <a
    href="#"
    className="relative text-[28px] font-extrabold leading-none tracking-tighter text-[#1F1F2B]"
  >
    Bolt
    <span className="absolute -bottom-1 left-[17px] h-[5px] w-[5px] rounded-full bg-[#1F1F2B]" />
  </a>
);

/* ---------- Componente ---------- */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Products");

  // Bloquea el scroll del fondo mientras el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cierra con la tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="pl-66 pr-66">
        {/* Barra superior */}
        <header className="sticky top-0 z-[60] bg-[#ffffff] opacity-100  ">
          <div className="flex h-[58px] items-center justify-between px-5">
            <Logo />

            <div className="flex items-center gap-5 sm:gap-7">
              <button className="flex items-center gap-2.5 text-sm font-semibold">
                <span className="flex h-[18px] w-[26px] items-center justify-center rounded-[4px] bg-[#1479F5] text-white">
                  <Globe />
                </span>
                EN
              </button>

              <a href="#" className="hidden text-sm font-medium sm:block">
                Support
              </a>

              <button className="rounded-full bg-[#2B2B3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1F1F2B]">
                Register
              </button>

              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="flex h-8 w-8 items-center justify-center"
              >
                {open ? (
                  <Svg className="h-6 w-6">
                    <path d="M5 5l14 14M19 5L5 19" />
                  </Svg>
                ) : (
                  <Svg className="h-6 w-6">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </Svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Menú desplegable a pantalla completa */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#F9FAFA] opacity-100 pt-[58px]"
            >
              <div className="mx-auto flex w-full flex-1 flex-col gap-3 px-5 pb-4 pt-9 lg:flex-row">
                {/* Panel principal */}
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="flex-1 rounded-[28px] bg-[#F0F1F3] p-5 lg:p-8"
                >
                  {/* Pestañas */}
                  <div className="flex flex-wrap gap-x-2 gap-y-1 lg:gap-x-5">
                    {tabs.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${tab === t ? "bg-white shadow-sm" : "hover:bg-white/60"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Enlaces */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 px-1 lg:grid-cols-4"
                    >
                      {menu[tab].map((group, gi) => (
                        <ul key={gi} className="space-y-[18px]">
                          {group.map((l, i) => (
                            <li key={l + i}>
                              <a
                                href="#"
                                className="block max-w-[170px] text-sm font-medium leading-snug text-[#1F1F2B] hover:underline"
                              >
                                {l}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Panel lateral */}
                <motion.aside
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="rounded-[28px] bg-[#F0F1F3] p-5 lg:w-[272px] lg:shrink-0"
                >
                  <ul className="space-y-5">
                    {side.map((s) => (
                      <li key={s.title}>
                        <a href="#" className="flex items-start justify-between gap-3">
                          <span className="flex gap-3">
                            <span className={`mt-0.5 ${s.color}`}>{s.icon}</span>
                            <span>
                              <span className="block text-sm font-semibold leading-snug">
                                {s.title}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-black/55">
                                {s.text}
                              </span>
                            </span>
                          </span>
                          <span className="mt-0.5 shrink-0">
                            <Chevron />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.aside>
              </div>

              {/* Pie del menú */}
              <div className="flex flex-col items-start justify-between gap-4 px-5 pb-6 pt-4 text-xs text-black/60 sm:flex-row sm:items-center">
                <div className="flex gap-6">
                  {socials.map((icon, i) => (
                    <a key={i} href="#" className="transition hover:text-black">
                      {icon}
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <a href="#" className="hover:text-black">Terms &amp; Conditions</a>
                  <a href="#" className="hover:text-black">Privacy</a>
                  <a href="#" className="hover:text-black">Cookies</a>
                  <span>© {new Date().getFullYear()} Bolt Technology OÜ</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </>
  );
}