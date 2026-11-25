import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

/**
 * Protege rutas.
 * - `admin`: solo administradores de la plataforma (backoffice).
 * - Sin `admin` (portal): comercios; un administrador debe haber elegido antes un comercio para gestionar.
 */
export default function RequireAuth({ admin = false }) {
  const { isAuthenticated, isAdmin, merchantId } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (admin && !isAdmin) return <Navigate to="/portal" replace />;
  if (!admin && isAdmin && !merchantId) return <Navigate to="/backoffice/comercios" replace />;
  return <Outlet />;
}
