import { cn } from "../../lib/cn";

export default function Field({ label = "", className, children }) {
  return (
    <label className={cn("block text-sm text-ink/70", className)}>
      {label}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}
