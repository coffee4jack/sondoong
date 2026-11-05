/**
 * Contenido interno (paths, círculos, etc.) de los iconos SVG del menú.
 * Son cadenas estáticas definidas aquí; se pintan con <Svg :inner="..." />.
 */
export const icons = {
  globe:
    '<circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />',
  chevron: '<path d="M9 6l6 6-6 6" />',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" />',
  close: '<path d="M5 5l14 14M19 5L5 19" />',
  driver: '<circle cx="12" cy="7" r="3.5" /><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5z" />',
  courier:
    '<circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-8h5l3 8M10 9H8" />',
  restaurant: '<path d="M7 3v8M4 3v5a3 3 0 006 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10" />',
  fleet: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 13h.01M17 13h.01" />',
  business: '<rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V4h6v3M3 13h18" />',
  facebook:
    '<circle cx="12" cy="12" r="9" /><path d="M13.5 20v-7h2.5M10.5 13h3M13.5 13c0-3 0-4 2.5-4" />',
  x: '<path d="M4 4l16 16M20 4L4 20" />',
  instagram:
    '<rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><path d="M16.5 7.5h.01" />',
  linkedin: '<path d="M6 10v8M6 6.5v.01M10 18v-8M10 13c0-2 1.5-3 3-3s3 1 3 3v5" />',
  tiktok: '<path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5M14 4c.4 2.2 1.8 3.6 4 4" />',
};
