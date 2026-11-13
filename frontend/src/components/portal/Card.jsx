import { cn } from "../../lib/cn";

/** Tarjeta. `as` cambia la etiqueta raíz (div, aside, form...). El resto de props pasa al elemento. */
export default function Card({ as: Tag = "div", className, children, ...rest }) {
  return (
    <Tag
      className={cn("portal-card rounded-[20px] border border-ink/10 bg-white p-5 shadow-sm", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
