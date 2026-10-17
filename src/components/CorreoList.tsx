import { useState } from "react";
import { Check } from "lucide-react";
import CorreoCard from "./CorreoCard";
import DecisionDialog from "./DecisionDialog";
import EmailDetailPanel from "./EmailDetailPanel";
import BulkActionsBar from "./BulkActionsBar";
import { useDecidirCorreo, useUpdateCorreo, useBulkUpdateCorreo } from "../hooks/useCorreos";
import { useToast } from "../contexts/ToastContext";
import type { Correo, Decision } from "../types";

interface Props {
  correos: Correo[];
  enableBulk?: boolean;
}

/** Lista con acciones (leído, reclasificar, aceptar/rechazar). Compartida por Dashboard y Correos. */
export default function CorreoList({ correos, enableBulk = false }: Props) {
  const { mutate, error, reset } = useUpdateCorreo();
  const bulkUpdate = useBulkUpdateCorreo();
  const decidir = useDecidirCorreo();
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dlg, setDlg] = useState<{ correo: Correo; modo: Decision } | null>(null);
  const [detailCorreo, setDetailCorreo] = useState<Correo | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [allSelected, setAllSelected] = useState(false);

  const cerrarDialogo = () => { decidir.reset(); setDlg(null); };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(correos.map((c) => c.message_id)));
    }
    setAllSelected(!allSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setAllSelected(false);
  };

  const handleBulkMarkRead = () => {
    if (selectedIds.size === 0) return;
    bulkUpdate.mutate(
      { ids: Array.from(selectedIds), patch: { leido: true } },
      {
        onSuccess: () => {
          showToast("success", `${selectedIds.size} correos marcados como leídos`);
          clearSelection();
        },
      }
    );
  };

  return (
    <>
      {error && (
        <div role="alert" className="mb-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          <span>No se pudo actualizar el correo: {error.message}</span>
          <button onClick={reset} className="font-semibold underline">Cerrar</button>
        </div>
      )}
      {enableBulk && (
        <BulkActionsBar
          selectedCount={selectedIds.size}
          onClearSelection={clearSelection}
          onMarkRead={handleBulkMarkRead}
          isProcessing={bulkUpdate.isPending}
        />
      )}
      {enableBulk && correos.length > 0 && (
        <label className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={allSelected && selectedIds.size === correos.length}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-gray-300 text-cuac-blue-600 focus:ring-cuac-blue-500 dark:border-slate-600 dark:bg-slate-700"
          />
          <span>Seleccionar todos ({correos.length})</span>
        </label>
      )}
      <ul className="space-y-3">
        {correos.map((c) => (
          <li key={c.message_id}>
            <div className="flex gap-3">
              {enableBulk && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.message_id)}
                  onChange={() => toggleSelection(c.message_id)}
                  className="mt-5 h-4 w-4 shrink-0 rounded border-gray-300 text-cuac-blue-600 focus:ring-cuac-blue-500 dark:border-slate-600 dark:bg-slate-700"
                />
              )}
              <div className="flex-1">
                <CorreoCard
                  correo={c}
                  busy={busyId === c.message_id}
                  onDecide={(correo, modo) => setDlg({ correo, modo })}
                  onViewDetail={setDetailCorreo}
                  onUpdate={(id, patch) => {
                    setBusyId(id);
                    mutate(
                      { id, patch },
                      {
                        onSuccess: () => {
                          if (patch.leido !== undefined) {
                            showToast("success", patch.leido ? "Correo marcado como leído" : "Correo marcado como no leído");
                          }
                          if (patch.categoria) {
                            showToast("success", "Correo reclasificado correctamente");
                          }
                        },
                        onSettled: () => setBusyId(null),
                      }
                    );
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {dlg && (
        <DecisionDialog
          correo={dlg.correo}
          modo={dlg.modo}
          pending={decidir.isPending}
          error={decidir.error?.message ?? null}
          onClose={cerrarDialogo}
          onConfirm={(motivo) =>
            decidir.mutate(
              { id: dlg.correo.message_id, decision: dlg.modo, motivo },
              {
                onSuccess: () => {
                  showToast("success", dlg.modo === "aceptar" ? "Solicitud aceptada: el formulario fue enviado al solicitante." : "Solicitud rechazada: el correo con el motivo fue enviado al solicitante.");
                  setDlg(null);
                },
              }
            )
          }
        />
      )}
      <EmailDetailPanel
        correo={detailCorreo}
        onClose={() => setDetailCorreo(null)}
        onMarkRead={(id) => {
          mutate({ id, patch: { leido: true } }, {
            onSuccess: () => {
              showToast("success", "Correo marcado como leído");
              setDetailCorreo(null);
            },
          });
        }}
        onTagsChange={(id, etiquetas) => {
          mutate({ id, patch: { etiquetas } as any }, {
            onSuccess: () => {
              showToast("success", "Etiquetas actualizadas");
            },
          });
        }}
        onAssignChange={(id, asignadoA) => {
          mutate({ id, patch: { asignado_a: asignadoA } as any }, {
            onSuccess: () => {
              showToast("success", asignadoA ? "Responsable asignado" : "Responsable desasignado");
            },
          });
        }}
      />
    </>
  );
}
