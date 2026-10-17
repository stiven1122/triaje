import { Check, Loader2, X } from "lucide-react";

interface Props {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkRead: () => void;
  isProcessing: boolean;
}

export default function BulkActionsBar({ selectedCount, onClearSelection, onMarkRead, isProcessing }: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-20 mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {selectedCount} {selectedCount === 1 ? "correo seleccionado" : "correos seleccionados"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMarkRead}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cuac-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cuac-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cuac-blue-500 dark:hover:bg-cuac-blue-400"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
          Marcar como leídos
        </button>
        <button
          onClick={onClearSelection}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <X className="h-4 w-4" aria-hidden />
          Cancelar selección
        </button>
      </div>
    </div>
  );
}
