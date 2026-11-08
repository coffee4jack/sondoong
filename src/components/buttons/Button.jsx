import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-brand hover:brightness-110",
  dark: "bg-ink hover:bg-ink/85",
  light: "border border-ink/15 bg-white hover:bg-ink/5",
  outline: "border border-mute bg-transparent hover:bg-ink/5",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-base",
};

const textColors = {
  white: "text-white",
  black: "text-black",
  ink: "text-ink",
};

/**
 * Botón único de la app.
 *
 * - `to` renderiza un <Link> del router
 * - `href` renderiza un <a>
 * - Sin ninguno renderiza un <button>
 * - Acepta contenido por `children`, o bien `text` / `title`
 * - `textColor` permite cambiar el color del texto
 * - El resto de props (onClick, disabled, aria-*...) se pasan al elemento
 */
export default function Button({
  variant = "primary",
  size = "md",
  pill = false,
  to,
  href,
  type = "button",
  text,
  title,
  textColor = "ink",
  className,
  children,
  ...rest
}) {
  const cls = cn(
    base,
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    textColors[textColor] ?? "text-ink",
    pill ? "rounded-full" : "rounded-xl",
    className
  );
  const content = children ?? text ?? title;

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  );
}
