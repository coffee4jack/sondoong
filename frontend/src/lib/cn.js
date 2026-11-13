/** Une clases CSS ignorando valores vacíos (false, null, undefined, ""). */
export const cn = (...parts) => parts.filter(Boolean).join(" ");
