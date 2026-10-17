import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { page: number; totalPages: number; total: number; onChange: (p: number) => void }

const btn = "inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600";

export default function Pagination({ page, totalPages, total, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Paginación" className="mt-5 flex items-center justify-between gap-3">
      <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">Página {page} de {totalPages} · {total} correos</p>
      <div className="flex gap-2">
        <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" aria-hidden /> Anterior
        </button>
        <button className={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Siguiente <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
