import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export const LoadingList = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3" role="status" aria-label="Cargando correos">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex gap-3">
          <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ErrorBox = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center">
    <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
    <div className="flex-1">
      <p className="font-semibold text-red-900">No se pudieron cargar los datos</p>
      <p className="text-sm text-red-800">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">
        <RefreshCw className="h-4 w-4" aria-hidden /> Reintentar
      </button>
    )}
  </div>
);

export const EmptyState = ({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800">
    <Inbox className="h-8 w-8 text-slate-400 dark:text-slate-600" aria-hidden />
    <p className="mt-3 font-semibold text-slate-900 dark:text-white">{title}</p>
    {hint && <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
