import { onMounted, onUnmounted, ref } from "vue";

/** Devuelve la hora actual (ms) como ref y se actualiza cada `every` ms. */
export default function useNow(every = 15000) {
  const now = ref(Date.now());
  let id;
  onMounted(() => {
    id = setInterval(() => {
      now.value = Date.now();
    }, every);
  });
  onUnmounted(() => clearInterval(id));
  return now;
}
