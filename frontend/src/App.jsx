import { Outlet, ScrollRestoration } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <div className="font-sans antialiased">
      <AuthProvider>
        <Outlet />
      </AuthProvider>
      {/* Equivale al scrollBehavior del router de Vue: arriba en cada ruta nueva y respeta #anclas */}
      <ScrollRestoration />
    </div>
  );
}
