export const fieldCls =
  "h-11 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

export const STATUS_LABEL = { pending: "Por aprobar", active: "Activo", paused: "Pausado", suspended: "Suspendido" };
export const ROLE_LABEL = { owner: "Dueño", manager: "Gerente", staff: "Equipo" };

export const statusBadge = (status) =>
  status === "active" ? "bg-brand/15 text-[#0f5a3a]" : status === "pending" ? "bg-amber-100 text-amber-900" : "bg-ink/10 text-ink/70";
