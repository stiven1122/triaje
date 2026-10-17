import { User } from "lucide-react";
import { capitalizar } from "../utils/format";

interface Props {
  porAsignado: Record<string, number>;
  onFilter?: (asignado: string) => void;
}

export default function AssignmentSummary({ porAsignado, onFilter }: Props) {
  const asignados = Object.entries(porAsignado).sort((a, b) => b[1] - a[1]);
  const total = asignados.reduce((sum, [, count]) => sum + count, 0);

  if (asignados.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800">
        <User className="mx-auto h-8 w-8 text-gray-400 dark:text-slate-600" aria-hidden />
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">No hay asignaciones registradas</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <User className="h-4 w-4" aria-hidden />
        Solicitudes por responsable
      </h3>
      <div className="space-y-3">
        {asignados.map(([asignado, count]) => {
          const porcentaje = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={asignado} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{asignado}</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {count} ({porcentaje.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                <div
                  className="h-full bg-cuac-blue-600 transition-all duration-500 dark:bg-cuac-blue-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
