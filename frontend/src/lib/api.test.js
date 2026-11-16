import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";

afterEach(() => vi.restoreAllMocks());

describe("API fetch client", () => {
  it("sends object bodies as JSON for existing portal callers", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      status: 201,
      ok: true,
      json: async () => ({ id: 42 }),
    });

    await expect(api("/orders/", { method: "POST", body: { status: "new" } })).resolves.toEqual({ id: 42 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/orders/"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ status: "new" }),
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("turns a JSON API validation response into a readable error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      status: 400,
      ok: false,
      json: async () => ({ latitude: ["Latitud inválida"] }),
    });

    await expect(api("/orders/1/location/", { method: "POST", body: { latitude: 99 } })).rejects.toThrow("latitude: [\"Latitud inválida\"]");
  });
});
