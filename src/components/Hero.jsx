import { useState } from "react";
import { motion } from "framer-motion";

import Button from "./buttons/Button"

const tabs = ["Viaje", "Comida", "Scooter"];

export default function Hero() {
  const [tab, setTab] = useState("Viaje");

  return (
    // <section className="relative overflow-hidden bg-[#ffffff]">
    //   <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
    //     <motion.div
    //       initial={{ opacity: 0, x: -40 }}
    //       animate={{ opacity: 1, x: 0 }}
    //       transition={{ duration: 0.6 }}
    //     >
    //       <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
    //         Muévete a tu manera
    //       </h1>
    //       <p className="mt-5 max-w-md text-lg text-black/60">
    //         Pide un viaje, súbete y listo. Viajes rápidos y a buen precio, cuando los necesites.
    //       </p>

    //       <div className="mt-8 max-w-md rounded-3xl bg-white p-5 shadow-xl shadow-black/5">
    //         <div className="mb-4 flex gap-2">
    //           {tabs.map((t) => (
    //             <button
    //               key={t}
    //               onClick={() => setTab(t)}
    //               className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${tab === t ? "bg-[#09090B] text-white" : "bg-black/5 text-black/70 hover:bg-black/10"
    //                 }`}
    //             >
    //               {t}
    //             </button>
    //           ))}
    //         </div>

    //         <div className="space-y-3">
    //           <div className="flex items-center gap-3 rounded-xl bg-black/5 px-4 py-3">
    //             <span className="h-2.5 w-2.5 rounded-full bg-[#34D186]" />
    //             <input
    //               className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
    //               placeholder="Lugar de recogida"
    //             />
    //           </div>
    //           <div className="flex items-center gap-3 rounded-xl bg-black/5 px-4 py-3">
    //             <span className="h-2.5 w-2.5 bg-black" />
    //             <input
    //               className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
    //               placeholder="Destino"
    //             />
    //           </div>
    //           <motion.button
    //             whileHover={{ scale: 1.02 }}
    //             whileTap={{ scale: 0.98 }}
    //             className="w-full rounded-xl bg-[#34D186] py-3.5 font-bold text-black"
    //           >
    //             Ver precios
    //           </motion.button>
    //         </div>
    //       </div>
    //     </motion.div>

    //     <motion.div
    //       initial={{ opacity: 0, scale: 0.9 }}
    //       animate={{ opacity: 1, scale: 1 }}
    //       transition={{ duration: 0.7, delay: 0.2 }}
    //       className="relative mx-auto aspect-square w-full max-w-md"
    //     >
    //       <div className="absolute inset-0 rounded-[3rem] bg-[#34D186]" />
    //       <motion.div
    //         animate={{ y: [0, -12, 0] }}
    //         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    //         className="absolute inset-8 flex items-center justify-center rounded-[2.5rem] bg-[#09090B] text-8xl"
    //       >
    //         🚗
    //       </motion.div>
    //       <motion.div
    //         animate={{ y: [0, 10, 0] }}
    //         transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    //         className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-5 py-3 shadow-xl"
    //       >
    //         <p className="text-xs text-black/50">Llegada estimada</p>
    //         <p className="text-lg font-bold">3 min</p>
    //       </motion.div>
    //     </motion.div>
    //   </div>
    // </section>



    <section className="relative overflow-hidden bg-[#ffffff] pt-20 ">
      <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl text-center">
        Lorem Ipsum
      </h1>

      <p className="mt-5 max-w-md text-lg text-black/60 text-center mx-auto">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>

      <div className=" mx-auto 
      p-6
      font-semibold
      flex items-center justify-center">
        <Button title="Reservar Ahora" color="#498a4c" textColor="white" />
        <Button title="Reservar Ahora" color="#ebebeb" textColor="#000000" />
      </div>


      <div className="w-full h-1/2 mt-8 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/17445328/pexels-photo-17445328.jpeg"

          alt=""
          className="w-full h-160 object-cover"
        />
      </div>


    </section>


  );
}
