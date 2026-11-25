// Sesión del usuario en localStorage: token, datos del usuario y comercio activo.
const KEY = "bolt-session-v1";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("session-change"));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("session-change"));
}

/** Cabeceras de autenticación para la API (vacías si no hay sesión). */
export function authHeaders() {
  const session = getSession();
  if (!session?.token) return {};
  return {
    Authorization: `Token ${session.token}`,
    ...(session.merchantId ? { "X-Merchant-Id": String(session.merchantId) } : {}),
  };
}
