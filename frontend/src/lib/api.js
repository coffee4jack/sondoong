import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const client = axios.create({ baseURL, headers: { "Content-Type": "application/json" } });

export async function api(path, options = {}) {
  try {
    const response = await client.request({ url: path, ...options });
    return response.status === 204 ? null : response.data;
  } catch (error) {
    const body = error.response?.data;
    const detail = body && typeof body === "object"
      ? Object.entries(body).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join("; ")
      : "";
    throw new Error(detail || body?.detail || error.message || "Error de conexión");
  }
}
