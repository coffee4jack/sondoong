import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";
import { authHeaders, clearSession, getSession, setSession } from "./session";

function stubBrowser() {
  const store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  });
  vi.stubGlobal("window", { dispatchEvent: () => true });
  vi.stubGlobal("Event", class { constructor(type) { this.type = type; } });
}

beforeEach(stubBrowser);
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("sesión", () => {
  it("guarda, lee y borra la sesión", () => {
    expect(getSession()).toBeNull();
    setSession({ token: "abc", merchantId: 3 });
    expect(getSession().token).toBe("abc");
    clearSession();
    expect(getSession()).toBeNull();
  });

  it("arma las cabeceras con token y comercio activo", () => {
    expect(authHeaders()).toEqual({});
    setSession({ token: "abc", merchantId: 3 });
    expect(authHeaders()).toEqual({ Authorization: "Token abc", "X-Merchant-Id": "3" });
    setSession({ token: "abc", merchantId: null });
    expect(authHeaders()).toEqual({ Authorization: "Token abc" });
  });

  it("la API envía el token y cierra la sesión si el servidor responde 401", async () => {
    setSession({ token: "abc", merchantId: 3 });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ status: 401, ok: false, json: async () => ({ detail: "Token inválido." }) });
    await expect(api("/orders/")).rejects.toThrow("Token inválido");
    expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ Authorization: "Token abc", "X-Merchant-Id": "3" });
    expect(getSession()).toBeNull();
  });
});
