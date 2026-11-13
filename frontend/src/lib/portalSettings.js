export const PORTAL_SETTINGS_KEY = "portal-settings-v1";

export const DEFAULT_PORTAL_SETTINGS = {
  brand: "#3bb77e",
  ink: "#010f1c",
  surface: "#ffffff",
  sidebar: "#010f1c",
  businessName: "Restaurante El Sabor",
  branchName: "Sucursal Centro",
  compact: false,
};

export function readPortalSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(PORTAL_SETTINGS_KEY) || "{}");
    return { ...DEFAULT_PORTAL_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_PORTAL_SETTINGS };
  }
}

export function savePortalSettings(settings) {
  localStorage.setItem(PORTAL_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("portal-settings-change"));
}
