import { User, X } from "lucide-react";
import { useState } from "react";

interface Props {
  asignadoA: string | null;
  onAssign: (persona: string) => void;
  onUnassign: () => void;
}

const PERSONAS_PREDEFINIDAS = [
  "Coordinador Académico",
  "Coordinador Administrativo",
  "Secretaría General",
  "Bienestar Universitario",
  "Oficina Admisiones",
  "Oficina Financiera",
  "Dirección de Programa",
  "Vicerrectoría",
];

export default function AssignedTo({ asignadoA, onAssign, onUnassign }: Props) {
  const [mostrarLista, setMostrarLista] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const personasFiltradas = PERSONAS_PREDEFINIDAS.filter((p) =>
    p.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAssign = (persona: string) => {
    onAssign(persona);
    setMostrarLista(false);
    setBusqueda("");
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
        Asignado a
      </label>

      {asignadoA ? (
        <div className="flex items-center justify-between rounded-lg border border-cuac-blue-200 bg-cuac-blue-50 px-3 py-2 dark:border-cuac-blue-800 dark:bg-cuac-blue-900/20">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-cuac-blue-600 dark:text-cuac-blue-400" aria-hidden />
            <span className="text-sm font-medium text-cuac-blue-900 dark:text-cuac-blue-300">
              {asignadoA}
            </span>
          </div>
          <button
            onClick={onUnassign}
            className="rounded p-1 text-cuac-blue-600 hover:bg-cuac-blue-200 dark:text-cuac-blue-400 dark:hover:bg-cuac-blue-800"
            aria-label="Desasignar"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setMostrarLista(!mostrarLista)}
          className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:border-cuac-blue-400 hover:text-cuac-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:border-cuac-blue-500 dark:hover:text-cuac-blue-400"
        >
          <User className="h-4 w-4" aria-hidden />
          <span>Asignar responsable</span>
        </button>
      )}

      {mostrarLista && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
          <div className="p-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar persona..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {personasFiltradas.map((persona) => (
              <button
                key={persona}
                onClick={() => handleAssign(persona)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-cuac-blue-50 dark:text-slate-300 dark:hover:bg-cuac-blue-900/20"
              >
                <User className="h-4 w-4 text-gray-400" aria-hidden />
                {persona}
              </button>
            ))}
            {personasFiltradas.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500 dark:text-slate-500">
                No se encontraron resultados
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
