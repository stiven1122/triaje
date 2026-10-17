import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { CorreosFiltros } from "../types";

/** Los filtros viven en la URL: compartibles y sobreviven al refresco. */
export function useFilters() {
  const [sp, setSp] = useSearchParams();
  const filtros = useMemo<CorreosFiltros>(
    () => ({
      categoria: sp.get("categoria") ?? "",
      prioridad: (sp.get("prioridad") as CorreosFiltros["prioridad"]) ?? "",
      leido: (sp.get("leido") as CorreosFiltros["leido"]) ?? "",
      estado: (sp.get("estado") ?? "") as CorreosFiltros["estado"],
      q: sp.get("q") ?? "",
      page: Number(sp.get("page") ?? 1) || 1,
    }),
    [sp],
  );

  const setFiltro = useCallback(
    (patch: Partial<CorreosFiltros>) => {
      const next = new URLSearchParams(sp);
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, String(v)) : next.delete(k)));
      if (!("page" in patch)) next.delete("page");
      setSp(next, { replace: true });
    },
    [sp, setSp],
  );

  const limpiar = useCallback(() => setSp({}, { replace: true }), [setSp]);
  const hayFiltros = Boolean(filtros.categoria || filtros.prioridad || filtros.leido || filtros.estado || filtros.q);
  return { filtros, setFiltro, limpiar, hayFiltros };
}
