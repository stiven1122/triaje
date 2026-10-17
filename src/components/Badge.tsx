import { capitalizar } from "../utils/format";
import type { Estado, Prioridad } from "../types";

const base = "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold";

const CAT: Record<string, string> = {
  urgente: "bg-cuac-yellow-100 text-cuac-yellow-900 dark:bg-cuac-yellow-900/30 dark:text-cuac-yellow-300",
  académico: "bg-cuac-blue-100 text-cuac-blue-800 dark:bg-cuac-blue-900/30 dark:text-cuac-blue-300",
  administrativo: "bg-cuac-blue-100 text-cuac-blue-800 dark:bg-cuac-blue-900/30 dark:text-cuac-blue-300",
  promociones: "bg-cuac-yellow-100 text-cuac-yellow-800 dark:bg-cuac-yellow-900/30 dark:text-cuac-yellow-300",
  otros: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};
const PRI: Record<Prioridad, { cls: string; dot: string }> = {
  alta: { cls: "bg-cuac-blue-100 text-cuac-blue-800 dark:bg-cuac-blue-900/30 dark:text-cuac-blue-300", dot: "bg-cuac-blue-600 dark:bg-cuac-blue-500" },
  media: { cls: "bg-cuac-yellow-100 text-cuac-yellow-800 dark:bg-cuac-yellow-900/30 dark:text-cuac-yellow-300", dot: "bg-cuac-yellow-600 dark:bg-cuac-yellow-500" },
  baja: { cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", dot: "bg-green-600 dark:bg-green-500" },
};

export const CategoriaBadge = ({ categoria }: { categoria: string }) => (
  <span className={`${base} ${CAT[categoria] ?? CAT.otros}`}>{capitalizar(categoria)}</span>
);

export const PrioridadBadge = ({ prioridad }: { prioridad: Prioridad }) => (
  <span className={`${base} ${PRI[prioridad].cls}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${PRI[prioridad].dot}`} aria-hidden />
    Prioridad {prioridad}
  </span>
);

const EST: Record<Estado, { cls: string; label: string } | null> = {
  pendiente: { cls: "bg-cuac-yellow-100 text-cuac-yellow-900 ring-1 ring-cuac-yellow-300 dark:bg-cuac-yellow-900/30 dark:text-cuac-yellow-300 dark:ring-cuac-yellow-700", label: "Pendiente de decisión" },
  aceptada: { cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", label: "Aceptada · formulario enviado" },
  rechazada: { cls: "bg-cuac-blue-900 text-white dark:bg-cuac-blue-800 dark:text-cuac-white-200", label: "Rechazada" },
  no_aplica: null,
};

export const EstadoBadge = ({ estado }: { estado: Estado }) => {
  const e = EST[estado];
  return e ? <span className={`${base} ${e.cls}`}>{e.label}</span> : null;
};
