import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Svg from "./Svg";
import { icons } from "./navIcons";
import { cn } from "../../lib/cn";

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

const side = [
  {
    title: "Become a driver",
    text: "Make money on your terms",
    icon: "driver",
  },
  {
    title: "Become a courier",
    text: "Deliver food and get paid weekly",
    icon: "courier",
  },
  {
    title: "Add a restaurant or store",
    text: "Reach more customers and increase earnings",
    icon: "restaurant",
  },
  {
    title: "Sign up as a fleet owner",
    text: "Add your fleet to Bolt and boost your income",
    icon: "fleet",
  },
  {
    title: "Bolt for Business",
    text: "Bolt products and services scaled-up for your business",
    icon: "business",
  },
];

const socials = [
  "facebook",
  "x",
  "instagram",
  "linkedin",
  "tiktok",
];

/* Contenedor común: más angosto, con margen a los lados */
const CONTAINER =
  "mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-14";

const year = new Date().getFullYear();

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Products");
  const { pathname } = useLocation();

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

  // Cierra el menú al navegar a otra ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Barra superior */}
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <header className="sticky top-0 z-[60] border-b border-ink/5 bg-white/90 backdrop-blur-md">
          <div
            className={cn(
              CONTAINER,
              "flex h-[68px] items-center justify-between"
            )}
          >
            {/* Logo */}
            <Link
              to="/"
              className="relative text-[28px] font-bold leading-none tracking-tighter text-ink"
            >
              Bolt

              <span className="absolute -bottom-1 left-[17px] h-[5px] w-[5px] rounded-full bg-ink" />
            </Link>

            <div className="flex items-center gap-5 sm:gap-7">
              {/* Idioma */}
              <button className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
                <span className="flex h-[18px] w-[26px] items-center justify-center rounded-[4px] bg-ink text-white">
                  <Svg
                    inner={icons.globe}
                    size="h-3.5 w-3.5"
                  />
                </span>

                EN
              </button>

              {/* Support */}
              <a
                href="#"
                className="hidden cursor-pointer text-sm font-medium sm:block"
              >
                Support
              </a>

              {/* Para comercios */}
              <Link
                to="/portal"
                className="hidden cursor-pointer text-sm font-medium sm:block"
              >
                Para comercios
              </Link>

              {/* Register */}
              <button
                className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-ink/85"
              >
                Register
              </button>

              {/* Botón menú */}
              <button
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="flex h-8 w-8 cursor-pointer items-center justify-center"
                onClick={() => setOpen((v) => !v)}
              >
                <Svg
                  inner={open ? icons.close : icons.menu}
                  size="h-6 w-6"
                />
              </button>
            </div>
          </div>
        </header>
      </motion.div>

      {/* Menú desplegable a pantalla completa */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pt-[113px]"
          >
            <div className={CONTAINER}>
              {/* Paneles: principal flexible + lateral de 280px */}
              <div className="grid gap-3 lg:grid-cols-[1fr_280px]">

                {/* Panel principal */}
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.05,
                    duration: 0.3,
                  }}
                  className="rounded-3xl bg-white p-6 lg:h-[600px] lg:p-8"
                >
                  {/* Pestañas */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {tabs.map((t) => (
                      <button
                        key={t}
                        className={cn(
                          "cursor-pointer rounded-xl px-[9px] py-[9px] text-[15px] font-bold leading-6 transition",
                          tab === t
                            ? "bg-brand text-ink"
                            : "hover:bg-ink/5"
                        )}
                        onClick={() => setTab(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Enlaces: 4 columnas */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 px-[9px] lg:grid-cols-4 lg:gap-y-12"
                    >
                      {menu[tab].map((group, gi) => (
                        <ul
                          key={gi}
                          className="flex flex-col gap-5"
                        >
                          {group.map((l, i) => (
                            <li key={l + i}>
                              <a
                                href="#"
                                className="block max-w-[160px] cursor-pointer text-[15px] font-medium leading-6 text-ink hover:underline"
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
                  initial={{
                    y: 12,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.1,
                    duration: 0.3,
                  }}
                  className="rounded-3xl bg-white p-6 lg:h-[600px] lg:p-8 lg:pt-10"
                >
                  <ul className="space-y-9">
                    {side.map((s) => (
                      <li key={s.title}>
                        <a
                          href="#"
                          className="flex cursor-pointer items-start justify-between gap-3"
                        >
                          <span className="flex gap-[11px]">
                            <span className="mt-1 shrink-0 text-ink">
                              <Svg inner={icons[s.icon]} />
                            </span>

                            <span>
                              <span className="block text-[15px] font-bold leading-6">
                                {s.title}
                              </span>

                              <span className="mt-[5px] block text-[13px] leading-[18px] text-ink/65">
                                {s.text}
                              </span>
                            </span>
                          </span>

                          <span className="mt-1 shrink-0">
                            <Svg inner={icons.chevron} />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.aside>
              </div>

              {/* Pie del menú */}
              <div className="mt-14 flex flex-col items-start justify-between gap-4 pb-12 text-[13px] text-ink/60 sm:flex-row sm:items-center">

                {/* Redes sociales */}
                <div className="flex gap-8 pl-[11px]">
                  {socials.map((name) => (
                    <a
                      key={name}
                      href="#"
                      className="cursor-pointer transition hover:text-ink"
                    >
                      <Svg
                        inner={icons[name]}
                        size="h-[18px] w-[18px]"
                      />
                    </a>
                  ))}
                </div>

                {/* Footer links */}
                <div className="flex flex-wrap items-center gap-x-[18px] gap-y-1">
                  <a
                    href="#"
                    className="cursor-pointer hover:text-ink"
                  >
                    Terms &amp; Conditions
                  </a>

                  <a
                    href="#"
                    className="cursor-pointer hover:text-ink"
                  >
                    Privacy
                  </a>

                  <a
                    href="#"
                    className="cursor-pointer hover:text-ink"
                  >
                    Cookies
                  </a>

                  <span>
                    © {year} Bolt Technology OÜ
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}