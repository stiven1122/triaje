import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <Link to="/" className="mt-4 inline-block font-semibold text-signal hover:underline">Volver al resumen</Link>
    </div>
  );
}
