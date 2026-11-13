/** Icono SVG genérico: `inner` es el contenido interno y `size` las clases de tamaño. */
export default function Svg({ inner, size = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={size}
      aria-hidden="true"
      // Los iconos son cadenas estáticas definidas en navIcons.js, nunca entrada del usuario
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
