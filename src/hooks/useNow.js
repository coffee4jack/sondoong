import { useEffect, useState } from "react";

/** Devuelve la hora actual (ms) y se actualiza cada `every` ms. */
export default function useNow(every = 15000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}
