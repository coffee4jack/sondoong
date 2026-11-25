import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/buttons/Button";
import { fieldCls } from "../components/backoffice/ui";
import { useAuth } from "../lib/useAuth";

export default function Login() {
  const { isAuthenticated, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const home = isAdmin ? "/backoffice" : "/portal";
  if (isAuthenticated) return <Navigate to={params.get("next") || home} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email.trim(), password);
      const next = params.get("next");
      navigate(next && next.startsWith("/") ? next : data.user.is_admin ? "/backoffice" : "/portal", { replace: true });
    } catch (err) {
      setError(err.message.replace(/^detail: /, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white text-ink lg:grid-cols-2">
      <section className="hidden flex-col justify-between rounded-r-[40px] bg-ink p-14 text-white lg:flex">
        <Link to="/" className="text-4xl font-bold tracking-tighter">Bolt<span className="text-brand">.</span></Link>
        <div>
          <h2 className="max-w-md text-5xl font-bold leading-tight">Tu negocio, tus pedidos, todo en un lugar.</h2>
          <p className="mt-5 max-w-md text-lg text-white/65">Entra con tu cuenta de comercio o de administrador de la plataforma.</p>
        </div>
        <p className="text-sm text-white/50">© {new Date().getFullYear()} Bolt</p>
      </section>
      <main className="flex items-center justify-center px-6 py-16 sm:px-12">
        <form onSubmit={submit} className="w-full max-w-md" noValidate>
          <Link to="/" className="text-3xl font-bold tracking-tighter lg:hidden">Bolt<span className="text-brand">.</span></Link>
          <h1 className="mt-8 text-4xl font-bold lg:mt-0">Iniciar sesión</h1>
          <p className="mt-2 text-ink/65">Usa el correo con el que te registraron.</p>
          <label htmlFor="email" className="mt-8 block text-sm font-bold">Correo</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${fieldCls} mt-2`} />
          <label htmlFor="password" className="mt-5 block text-sm font-bold">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${fieldCls} mt-2`} />
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <Button type="submit" size="lg" className="mt-7 w-full" disabled={loading || !email || !password}>{loading ? "Entrando…" : "Entrar"}</Button>
          <p className="mt-6 text-center text-sm text-ink/65">¿Olvidaste tu contraseña? Pídele a soporte que la restablezca desde el backoffice.</p>
        </form>
      </main>
    </div>
  );
}
