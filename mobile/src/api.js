import axios from "axios";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const client = axios.create({ baseURL: API_URL, timeout: 15000, headers: { "Content-Type": "application/json" } });

export async function api(path, options = {}) {
  try {
    const response = await client.request({ url: path, ...options });
    return response.status === 204 ? null : response.data;
  } catch (error) {
    const data = error.response?.data;
    const detail = data && typeof data === "object"
      ? data.detail || Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join("; ")
      : null;
    throw new Error(detail || error.message || "Error de conexión");
  }
}

export const imageFor = (product) => product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600";
