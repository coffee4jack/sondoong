import { cn } from "../../lib/cn";

/**
 * Interruptor. Es "controlado": recibe `checked` y llama a `onChange` con el nuevo valor,
 * de modo que el padre puede aceptar o rechazar el cambio (p. ej. exigir un motivo).
 */
export default function Toggle({ checked = false, label = "", onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "relative h-6 w-[42px] shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        checked ? "bg-brand" : "bg-mute"
      )}
      onClick={() => onChange?.(!checked)}
    >
      <span
        className={cn(
          "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all",
          checked ? "left-[21px]" : "left-[3px]"
        )}
      />
    </button>
  );
}
