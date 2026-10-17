import FiltersBar from "../components/FiltersBar";
import CorreoList from "../components/CorreoList";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorBox, LoadingList } from "../components/QueryState";
import { useCorreos } from "../hooks/useCorreos";
import { useFilters } from "../hooks/useFilters";

export default function CorreosPage() {
  const { filtros, setFiltro, limpiar, hayFiltros } = useFilters();
  const { data, isLoading, isError, error, refetch, isFetching } = useCorreos(filtros);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Correos</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{data ? `${data.total} resultados` : "Todos los correos clasificados"}</p>
      </div>

      <FiltersBar filtros={filtros} onChange={setFiltro} onClear={limpiar} canClear={hayFiltros} />

      <div aria-busy={isFetching} className={isFetching && !isLoading ? "opacity-70 transition-opacity" : ""}>
        {isLoading ? <LoadingList />
          : isError ? <ErrorBox message={error.message} onRetry={() => refetch()} />
          : data!.data.length === 0 ? (
            <EmptyState title="No hay correos para mostrar"
              hint={hayFiltros ? "Ningún correo coincide con los filtros aplicados." : "Aún no hay correos clasificados."}
              action={hayFiltros && <button onClick={limpiar} className="rounded-lg bg-cuac-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cuac-blue-700">Quitar filtros</button>} />
          ) : (
            <>
              <CorreoList correos={data!.data} enableBulk />
              <Pagination page={data!.page} totalPages={data!.totalPages} total={data!.total} onChange={(p) => { setFiltro({ page: p }); window.scrollTo({ top: 0 }); }} />
            </>
          )}
      </div>
    </div>
  );
}
