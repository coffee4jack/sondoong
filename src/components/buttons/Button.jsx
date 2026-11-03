import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-brand text-ink hover:brightness-110",
  dark: "bg-ink text-white hover:bg-ink/85",
  light: "bg-white text-ink hover:bg-white/80",
  outline: "border border-mute bg-transparent text-ink hover:bg-ink/5",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-12 px-7 text-base",
};

/**
 * Botón único de la app.
 * - `to` renderiza un <Link> de react-router, `href` un <a>, y sin ninguno un <button>.
 * - Acepta `children` (también `text` o `title` por compatibilidad).
 */
export default function Button({
  variant = "primary",
  size = "md",
  pill = false,
  to,
  href,
  children,
  text,
  title,
  className = "",
  ...rest
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${pill ? "rounded-full" : "rounded-xl"} ${className}`;
  const label = children ?? text ?? title;

  if (to) return <Link to={to} className={cls} {...rest}>{label}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{label}</a>;
  return <button type="button" className={cls} {...rest}>{label}</button>;
}
