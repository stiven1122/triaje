import { Clock, Edit, Tag, User, Check, X } from "lucide-react";
import { formatFecha } from "../utils/format";

interface ActivityLogEntry {
  id: string;
  tipo: "cambio_estado" | "reclasificacion" | "etiqueta" | "asignacion" | "lectura";
  descripcion: string;
  autor: string;
  fecha: string;
}

interface Props {
  actividades: ActivityLogEntry[];
}

export default function ActivityLog({ actividades }: Props) {
  if (actividades.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
        <Clock className="mx-auto h-8 w-8 text-gray-400 dark:text-slate-600" aria-hidden />
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">No hay actividad registrada</p>
      </div>
    );
  }

  const getIcon = (tipo: ActivityLogEntry["tipo"]) => {
    switch (tipo) {
      case "cambio_estado":
        return Edit;
      case "reclasificacion":
        return Tag;
      case "etiqueta":
        return Tag;
      case "asignacion":
        return User;
      case "lectura":
        return Check;
      default:
        return Clock;
    }
  };

  const getIconColor = (tipo: ActivityLogEntry["tipo"]) => {
    switch (tipo) {
      case "cambio_estado":
        return "text-cuac-blue-600 dark:text-cuac-blue-400";
      case "reclasificacion":
        return "text-cuac-yellow-600 dark:text-cuac-yellow-400";
      case "etiqueta":
        return "text-green-600 dark:text-green-400";
      case "asignacion":
        return "text-purple-600 dark:text-purple-400";
      case "lectura":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <Clock className="h-4 w-4" aria-hidden />
        Historial de cambios
      </h4>
      <div className="space-y-2">
        {actividades.map((actividad) => {
          const Icon = getIcon(actividad.tipo);
          return (
            <div
              key={actividad.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`mt-0.5 shrink-0 ${getIconColor(actividad.tipo)}`}>
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">{actividad.descripcion}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                  <span>{actividad.autor}</span>
                  <span>·</span>
                  <time dateTime={actividad.fecha}>{formatFecha(actividad.fecha)}</time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
