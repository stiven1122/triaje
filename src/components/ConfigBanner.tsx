import { isApiConfigured } from "../services/http";
import { USE_MOCK } from "../services/mock";

export default function ConfigBanner() {
  if (USE_MOCK)
    return (
      <div role="status" className="mb-4 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
        <strong>Modo demostración:</strong> datos de ejemplo en memoria; no hay conexión con n8n. Quita <code>VITE_USE_MOCK</code> para usar tu API real.
      </div>
    );
  if (isApiConfigured) return null;
  return (
    <div role="alert" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
      Falta <code className="font-semibold">VITE_N8N_API_URL</code>. Copia <code>.env.example</code> a <code>.env</code> y reinicia el servidor de desarrollo
      (o usa <code>VITE_USE_MOCK=true</code> para ver la demo).
    </div>
  );
}
