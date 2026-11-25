import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { clearSession, getSession, setSession } from "./session";

export const AuthContext = createContext(null);

/** Proveedor de sesión: login, logout y comercio activo (los administradores eligen uno para "gestionar"). */
export function AuthProvider({ children }) {
  const [session, setLocal] = useState(getSession);

  useEffect(() => {
    const refresh = () => setLocal(getSession());
    window.addEventListener("session-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("session-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api("/auth/login/", { method: "POST", body: { email, password } });
    const first = data.memberships[0]?.merchant;
    setSession({ ...data, merchantId: data.user.is_admin ? null : first?.id ?? null, merchantName: data.user.is_admin ? null : first?.name ?? null });
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout/", { method: "POST" });
    } catch {
      // Si falla (sin red o token vencido) igual se limpia la sesión local.
    }
    clearSession();
  }, []);

  const selectMerchant = useCallback((merchant) => {
    const current = getSession();
    if (current) setSession({ ...current, merchantId: merchant?.id ?? null, merchantName: merchant?.name ?? null });
  }, []);

  const value = useMemo(() => ({
    user: session?.user ?? null,
    memberships: session?.memberships ?? [],
    isAdmin: Boolean(session?.user?.is_admin),
    isAuthenticated: Boolean(session?.token),
    merchantId: session?.merchantId ?? null,
    merchantName: session?.merchantName ?? null,
    login,
    logout,
    selectMerchant,
  }), [session, login, logout, selectMerchant]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
