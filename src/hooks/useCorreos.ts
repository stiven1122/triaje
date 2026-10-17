import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decidirCorreo, getCorreos, getEstadisticas, patchCorreo } from "../services/correosService";
import type { CorreoPatch, CorreosFiltros, CorreosResponse, Decision } from "../types";

export const useCorreos = (f: CorreosFiltros) =>
  useQuery({ queryKey: ["correos", f], queryFn: () => getCorreos(f), placeholderData: keepPreviousData });

export const useEstadisticas = () =>
  useQuery({ queryKey: ["estadisticas"], queryFn: getEstadisticas });

export function useUpdateCorreo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: CorreoPatch }) => patchCorreo(id, patch),
    // Actualización optimista: la tarjeta cambia al instante y se revierte si n8n falla
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["correos"] });
      const prev = qc.getQueriesData<CorreosResponse>({ queryKey: ["correos"] });
      qc.setQueriesData<CorreosResponse>({ queryKey: ["correos"] }, (old) =>
        old && { ...old, data: old.data.map((c) => (c.message_id === id ? { ...c, ...patch } : c)) });
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data)),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["correos"] });
      qc.invalidateQueries({ queryKey: ["estadisticas"] });
    },
  });
}

export function useBulkUpdateCorreo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, patch }: { ids: string[]; patch: CorreoPatch }) =>
      Promise.all(ids.map((id) => patchCorreo(id, patch))),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["correos"] });
      qc.invalidateQueries({ queryKey: ["estadisticas"] });
    },
  });
}

export function useDecidirCorreo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision, motivo }: { id: string; decision: Decision; motivo?: string }) => decidirCorreo(id, decision, motivo),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["correos"] });
      qc.invalidateQueries({ queryKey: ["estadisticas"] });
    },
  });
}
