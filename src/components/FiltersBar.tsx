import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../utils/useDebounce";
import { CATEGORIAS, PRIORIDADES } from "../utils/constants";
import { capitalizar } from "../utils/format";
import type { CorreosFiltros } from "../types";

interface Props {
  filtros: CorreosFiltros;
  onChange: (p: Partial<CorreosFiltros>) => void;
  onClear: () => void;
  canClear: boolean;
}

const sel = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200";

export default function FiltersBar({ filtros, onChange, onClear, canClear }: Props) {
  const [texto, setTexto] = useState(filtros.q ?? "");
  const debounced = useDebounce(texto);

  useEffect(() => { if (debounced !== (filtros.q ?? "")) onChange({ q: debounced }); }, [debounced]); // eslint-disable-line
  useEffect(() => { setTexto(filtros.q ?? ""); }, [filtros.q]);

  return (
    <form role="search" aria-label="Filtros de correos" onSubmit={(e) => e.preventDefault()}
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <label htmlFor="q" className="sr-only">Buscar por remitente o asunto</label>
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden />
        <input id="q" type="search" value={texto} onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar remitente o asunto…" className={`${sel} pl-9`} />
      </div>
      <div>
        <label htmlFor="f-cat" className="sr-only">Categoría</label>
        <select id="f-cat" className={sel} value={filtros.categoria} onChange={(e) => onChange({ categoria: e.target.value })}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{capitalizar(c)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-pri" className="sr-only">Prioridad</label>
        <select id="f-pri" className={sel} value={filtros.prioridad} onChange={(e) => onChange({ prioridad: e.target.value as CorreosFiltros["prioridad"] })}>
          <option value="">Cualquier prioridad</option>
          {PRIORIDADES.map((p) => <option key={p} value={p}>{capitalizar(p)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="f-leido" className="sr-only">Estado de lectura</label>
        <select id="f-leido" className={sel} value={filtros.leido} onChange={(e) => onChange({ leido: e.target.value as CorreosFiltros["leido"] })}>
          <option value="">Leídos y no leídos</option>
          <option value="false">No leídos</option>
          <option value="true">Leídos</option>
        </select>
      </div>
      <div>
        <label htmlFor="f-estado" className="sr-only">Estado de la solicitud</label>
        <select id="f-estado" className={sel} value={filtros.estado} onChange={(e) => onChange({ estado: e.target.value as CorreosFiltros["estado"] })}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes de decisión</option>
          <option value="aceptada">Aceptadas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="no_aplica">Sin solicitud</option>
        </select>
      </div>
      <button type="button" onClick={onClear} disabled={!canClear}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
        <X className="h-4 w-4" aria-hidden /> Limpiar
      </button>
    </form>
  );
}
