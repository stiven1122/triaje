import type { LucideIcon } from "lucide-react";

interface Props { label: string; value: number | string; icon: LucideIcon; tone?: "default" | "signal"; loading?: boolean }

export default function StatCard({ label, value, icon: Icon, tone = "default", loading }: Props) {
  const signal = tone === "signal";
  return (
    <div className={`rounded-xl border p-4 transition-shadow hover:shadow-md ${signal ? "border-cuac-yellow-300 bg-cuac-yellow-50 dark:bg-cuac-yellow-900/20" : "border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800"}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
        <Icon className={`h-4 w-4 ${signal ? "text-cuac-yellow-600" : "text-cuac-blue-700 dark:text-slate-300"}`} aria-hidden />
      </div>
      {loading ? (
        <div className="mt-2 h-8 w-14 animate-pulse rounded bg-gray-200 dark:bg-slate-700" aria-label="Cargando" />
      ) : (
        <p className={`mt-1 text-3xl font-bold tabular-nums transition-transform hover:scale-105 ${signal ? "text-cuac-yellow-600" : "text-cuac-blue-900 dark:text-white"}`}>{value}</p>
      )}
    </div>
  );
}
