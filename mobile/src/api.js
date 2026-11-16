const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

// Native fetch follows the shared JSON API contract; `data` is serialized to a request body.
export async function api(path, options = {}) {
  // The app uses fetch (not Axios) and converts native `data` objects to JSON once here.
  const { data, ...requestOptions } = options;
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      headers: {
        ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
        ...requestOptions.headers,
      },
      body: data !== undefined ? JSON.stringify(data) : requestOptions.body,
    });
  } catch (error) {
    throw new Error(`Error de conexión: ${error.message}`);
  }

  if (response.status === 204) return null;
  const responseText = await response.text();
  let responseData = null;
  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch {
    // Don't pass an HTML error page through React Native as renderable UI content.
    responseData = null;
  }
  if (!response.ok) {
    const detail = responseData && typeof responseData === "object"
      ? Object.entries(responseData).map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`).join("; ")
      : "";
    throw new Error(detail || `HTTP ${response.status}${responseText && !responseData ? ": respuesta no JSON del servidor" : ""}`);
  }
  return responseData;
}

export const imageFor = (product) => product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600";
