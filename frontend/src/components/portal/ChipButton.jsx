import { cn } from "../../lib/cn";

/** Botón tipo "chip". El onClick se aplica directamente al <button>. */
export default function ChipButton({ active = false, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60",
        active
          ? "bg-ink font-bold text-white"
          : "border border-ink/15 bg-white text-ink hover:bg-ink/5"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
