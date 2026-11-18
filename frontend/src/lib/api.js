const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

// Cliente fetch compartido. `body` puede ser un objeto (se serializa a JSON),
// un string ya serializado o FormData.
export async function api(path, options = {}) {
  const body = options.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: body !== undefined && !isFormData && typeof body !== "string" ? JSON.stringify(body) : body,
    });
  } catch (error) {
    throw new Error(`Error de conexión: ${error.message}`);
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data && typeof data === "object"
      ? Object.entries(data).map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`).join("; ")
      : "";
    throw new Error(detail || `Error HTTP ${response.status}`);
  }
  return data;
}
