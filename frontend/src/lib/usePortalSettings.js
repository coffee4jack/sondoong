import { useEffect, useState } from "react";
import { readPortalSettings } from "./portalSettings";

export function usePortalSettings() {
  const [settings, setSettings] = useState(readPortalSettings);

  useEffect(() => {
    const refresh = () => setSettings(readPortalSettings());
    window.addEventListener("storage", refresh);
    window.addEventListener("portal-settings-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("portal-settings-change", refresh);
    };
  }, []);

  return settings;
}
