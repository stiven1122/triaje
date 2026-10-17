import { Link, useNavigate } from "react-router-dom";
import { AlertOctagon, Flame, Hourglass, Inbox, Clock, TrendingUp, Users } from "lucide-react";
import StatCard from "../components/StatCard";
import CorreoList from "../components/CorreoList";
import AssignmentSummary from "../components/AssignmentSummary";
import { EmptyState, ErrorBox, LoadingList } from "../components/QueryState";
import { useCorreos, useEstadisticas } from "../hooks/useCorreos";
import { CATEGORIAS, URGENTE } from "../utils/constants";
import { capitalizar } from "../utils/format";

export default function DashboardPage() {
  const nav = useNavigate();
  const stats = useEstadisticas();
  const urgentes = useCorreos({ categoria: URGENTE, leido: "false", page: 1 });
  const pendientes = useCorreos({ estado: "pendiente", page: 1 });
  const s = stats.data;
  const categorias = Array.from(new Set([...CATEGORIAS, ...Object.keys(s?.porCategoria ?? {})]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Estado actual de tu bandeja clasificada.</p>
      </div>

      {stats.isError && <ErrorBox message={stats.error.message} onRetry={() => stats.refetch()} />}

      <section aria-label="Estadísticas" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total de correos" value={s?.total ?? 0} icon={Inbox} loading={stats.isLoading} />
        <StatCard label="Urgentes" value={s?.porCategoria[URGENTE] ?? 0} icon={Flame} tone="signal" loading={stats.isLoading} />
        <StatCard label="Prioridad alta" value={s?.porPrioridad.alta ?? 0} icon={AlertOctagon} loading={stats.isLoading} />
        <StatCard label="Pendientes de decisión" value={s?.porEstado?.pendiente ?? 0} icon={Hourglass} loading={stats.isLoading} />
      </section>

      <section aria-label="Métricas adicionales" className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Tiempo promedio respuesta"
          value={s?.tiempoPromedioRespuesta ? `${s.tiempoPromedioRespuesta.toFixed(1)}h` : "N/A"}
          icon={Clock}
          loading={stats.isLoading}
        />
        <StatCard
          label="Tasa de resolución"
          value={s?.tasaResolucion ? `${s.tasaResolucion.toFixed(0)}%` : "N/A"}
          icon={TrendingUp}
          loading={stats.isLoading}
        />
        <StatCard
          label="Asignados"
          value={Object.keys(s?.porAsignado ?? {}).length}
          icon={Users}
          loading={stats.isLoading}
        />
      </section>

      <section aria-labelledby="h-pend">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="h-pend" className="text-lg font-semibold text-slate-900 dark:text-white">Solicitudes por decidir</h2>
          <Link to="/correos?estado=pendiente" className="text-sm font-semibold text-cuac-blue-600 hover:underline dark:text-cuac-blue-400">Ver todas</Link>
        </div>
        {pendientes.isLoading ? <LoadingList rows={2} />
          : pendientes.isError ? <ErrorBox message={pendientes.error.message} onRetry={() => pendientes.refetch()} />
          : pendientes.data!.data.length === 0 ? <EmptyState title="Todo al día" hint="No hay solicitudes esperando tu decisión." />
          : <CorreoList correos={pendientes.data!.data} />}
      </section>

      <section aria-labelledby="h-cat">
        <h2 id="h-cat" className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Por categoría</h2>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button key={c} onClick={() => nav(`/correos?categoria=${encodeURIComponent(c)}`)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 ${c === URGENTE ? "border-cuac-yellow-400 text-cuac-yellow-600 dark:border-cuac-yellow-600 dark:text-cuac-yellow-400" : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"}`}>
              {capitalizar(c)}: <span className="font-bold tabular-nums">{s?.porCategoria[c] ?? 0}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="h-urg">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="h-urg" className="text-lg font-semibold text-slate-900 dark:text-white">Urgentes por atender</h2>
          <Link to="/correos?categoria=urgente" className="text-sm font-semibold text-cuac-blue-600 hover:underline dark:text-cuac-blue-400">Ver todos</Link>
        </div>
        {urgentes.isLoading ? <LoadingList rows={2} />
          : urgentes.isError ? <ErrorBox message={urgentes.error.message} onRetry={() => urgentes.refetch()} />
          : urgentes.data!.data.length === 0 ? <EmptyState title="Sin urgentes pendientes" hint="No hay correos urgentes sin leer." />
          : <CorreoList correos={urgentes.data!.data} />}
      </section>

      {s?.porAsignado && Object.keys(s.porAsignado).length > 0 && (
        <section aria-labelledby="h-asign">
          <h2 id="h-asign" className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Distribución de solicitudes</h2>
          <AssignmentSummary porAsignado={s.porAsignado} />
        </section>
      )}
    </div>
  );
}
