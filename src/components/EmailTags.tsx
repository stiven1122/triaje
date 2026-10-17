import { X, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  etiquetas: string[];
  onAdd: (etiqueta: string) => void;
  onRemove: (etiqueta: string) => void;
}

export default function EmailTags({ etiquetas, onAdd, onRemove }: Props) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [mostrarInput, setMostrarInput] = useState(false);

  const etiquetasPredefinidas = [
    "Estudiante",
    "Docente",
    "Administrativo",
    "Becario",
    "Egresado",
    "Externo",
    "Urgente",
    "Seguimiento",
    "Pendiente info",
    "Requiere cita",
  ];

  const handleAgregar = () => {
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta.trim())) {
      onAdd(nuevaEtiqueta.trim());
      setNuevaEtiqueta("");
      setMostrarInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAgregar();
    }
    if (e.key === "Escape") {
      setMostrarInput(false);
      setNuevaEtiqueta("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {etiquetas.map((etiqueta) => (
          <span
            key={etiqueta}
            className="inline-flex items-center gap-1 rounded-full bg-cuac-blue-100 px-3 py-1 text-sm font-medium text-cuac-blue-800 dark:bg-cuac-blue-900/30 dark:text-cuac-blue-300"
          >
            {etiqueta}
            <button
              onClick={() => onRemove(etiqueta)}
              className="rounded-full p-0.5 hover:bg-cuac-blue-200 dark:hover:bg-cuac-blue-800"
              aria-label={`Eliminar etiqueta ${etiqueta}`}
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </span>
        ))}
        <button
          onClick={() => setMostrarInput(!mostrarInput)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-sm font-medium text-gray-600 hover:border-cuac-blue-400 hover:text-cuac-blue-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-cuac-blue-500 dark:hover:text-cuac-blue-400"
        >
          <Plus className="h-3 w-3" aria-hidden />
          Agregar etiqueta
        </button>
      </div>

      {mostrarInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEtiqueta}
            onChange={(e) => setNuevaEtiqueta(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe una etiqueta..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            autoFocus
          />
          <button
            onClick={handleAgregar}
            className="rounded-lg bg-cuac-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cuac-blue-700 dark:bg-cuac-blue-500 dark:hover:bg-cuac-blue-400"
          >
            Agregar
          </button>
        </div>
      )}

      {etiquetas.length === 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-gray-500 dark:text-slate-500">Sugerencias:</span>
          {etiquetasPredefinidas.slice(0, 5).map((etiqueta) => (
            <button
              key={etiqueta}
              onClick={() => onAdd(etiqueta)}
              className="text-xs text-cuac-blue-600 hover:underline dark:text-cuac-blue-400"
            >
              {etiqueta}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
