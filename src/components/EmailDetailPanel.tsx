import { useEffect, useState } from "react";
import { X, Clock, User, Tag, Flag, MessageSquare, Send as SendIcon } from "lucide-react";
import { CategoriaBadge, PrioridadBadge, EstadoBadge } from "./Badge";
import { capitalizar, formatFecha, parseRemitente } from "../utils/format";
import EmailTags from "./EmailTags";
import AssignedTo from "./AssignedTo";
import ActivityLog from "./ActivityLog";
import type { Correo } from "../types";

interface Props {
  correo: Correo | null;
  onClose: () => void;
  onMarkRead?: (id: string) => void;
  onReclassify?: (id: string, categoria: string) => void;
  onTagsChange?: (id: string, etiquetas: string[]) => void;
  onAssignChange?: (id: string, asignadoA: string | null) => void;
}

export default function EmailDetailPanel({ correo, onClose, onMarkRead, onReclassify, onTagsChange, onAssignChange }: Props) {
  const [etiquetas, setEtiquetas] = useState<string[]>(correo?.etiquetas || []);
  const [asignadoA, setAsignadoA] = useState<string | null>(correo?.asignado_a || null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarios, setComentarios] = useState(correo?.comentarios || []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    setEtiquetas(correo?.etiquetas || []);
    setAsignadoA(correo?.asignado_a || null);
    setComentarios(correo?.comentarios || []);
  }, [correo]);

  const handleAddEtiqueta = (etiqueta: string) => {
    const nuevas = [...etiquetas, etiqueta];
    setEtiquetas(nuevas);
    onTagsChange?.(correo!.message_id, nuevas);
  };

  const handleRemoveEtiqueta = (etiqueta: string) => {
    const nuevas = etiquetas.filter((e) => e !== etiqueta);
    setEtiquetas(nuevas);
    onTagsChange?.(correo!.message_id, nuevas);
  };

  const handleAssign = (persona: string) => {
    setAsignadoA(persona);
    onAssignChange?.(correo!.message_id, persona);
  };

  const handleUnassign = () => {
    setAsignadoA(null);
    onAssignChange?.(correo!.message_id, null);
  };

  const handleAddComentario = () => {
    if (!nuevoComentario.trim()) return;
    const nuevo: any = {
      id: crypto.randomUUID(),
      texto: nuevoComentario,
      autor: "Usuario actual", // En producción, esto vendría del auth
      fecha: new Date().toISOString(),
    };
    const actualizados = [...comentarios, nuevo];
    setComentarios(actualizados);
    setNuevoComentario("");
    // Aquí llamaríamos a onComentariosChange si existiera
  };

  if (!correo) return null;

  const { nombre, email } = parseRemitente(correo.remitente);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="email-detail-title">
      <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="pointer-events-auto w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
              <h2 id="email-detail-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                Detalle del correo
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Cerrar panel"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 px-4 py-6 sm:px-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{correo.asunto}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <User className="h-4 w-4" aria-hidden />
                    <span className="font-medium">{nombre}</span>
                    {nombre !== email && <span className="text-slate-500">&lt;{email}&gt;</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                    <Clock className="h-4 w-4" aria-hidden />
                    <time dateTime={correo.fecha}>{formatFecha(correo.fecha)}</time>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <CategoriaBadge categoria={correo.categoria} />
                  <PrioridadBadge prioridad={correo.prioridad} />
                  <EstadoBadge estado={correo.estado} />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Tag className="h-4 w-4" aria-hidden />
                    Etiquetas
                  </h4>
                  <EmailTags
                    etiquetas={etiquetas}
                    onAdd={handleAddEtiqueta}
                    onRemove={handleRemoveEtiqueta}
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <User className="h-4 w-4" aria-hidden />
                    Responsable
                  </h4>
                  <AssignedTo
                    asignadoA={asignadoA}
                    onAssign={handleAssign}
                    onUnassign={handleUnassign}
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <MessageSquare className="h-4 w-4" aria-hidden />
                    Comentarios internos
                  </h4>
                  <div className="space-y-3">
                    {comentarios.length > 0 && (
                      <div className="space-y-2">
                        {comentarios.map((comentario: any) => (
                          <div key={comentario.id} className="rounded-lg bg-white p-3 dark:bg-slate-700">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{comentario.autor}</span>
                              <time className="text-xs text-gray-500 dark:text-slate-500">{formatFecha(comentario.fecha)}</time>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{comentario.texto}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                      />
                      <button
                        onClick={handleAddComentario}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cuac-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cuac-blue-700 dark:bg-cuac-blue-500 dark:hover:bg-cuac-blue-400"
                      >
                        <SendIcon className="h-4 w-4" aria-hidden />
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>

                <ActivityLog actividades={[]} />

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Tag className="h-4 w-4" aria-hidden />
                    Resumen
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{correo.resumen}</p>
                </div>

                {correo.estado === "rechazada" && correo.motivo_rechazo && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-300">
                      <Flag className="h-4 w-4" aria-hidden />
                      Motivo del rechazo
                    </h4>
                    <p className="text-sm leading-relaxed text-red-800 dark:text-red-200">{correo.motivo_rechazo}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">ID del mensaje:</span>
                    <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">{correo.message_id}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Estado de lectura:</span>
                    <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">{correo.leido ? "Leído" : "No leído"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex gap-3">
                {onMarkRead && (
                  <button
                    onClick={() => onMarkRead(correo.message_id)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {correo.leido ? "Marcar no leído" : "Marcar leído"}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700 dark:bg-signal dark:hover:bg-red-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
