import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-white p-6 text-center">
      <div>
        <h1 className="text-5xl font-bold">404</h1>
        <p className="mt-3 text-ink/70">Esta página no existe.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-bold text-ink">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
