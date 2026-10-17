import { Check, Eye, Loader2, Send, User, XCircle } from "lucide-react";
import { CategoriaBadge, EstadoBadge, PrioridadBadge } from "./Badge";
import { CATEGORIAS, URGENTE } from "../utils/constants";
import { capitalizar, formatFecha, parseRemitente } from "../utils/format";
import type { Correo, CorreoPatch, Decision } from "../types";

interface Props {
  correo: Correo;
  busy?: boolean;
  onUpdate: (id: string, patch: CorreoPatch) => void;
  onDecide: (c: Correo, d: Decision) => void;
  onViewDetail?: (c: Correo) => void;
}

export default function CorreoCard({ correo: c, busy, onUpdate, onDecide, onViewDetail }: Props) {
  const urgente = c.categoria === URGENTE;
  const { nombre, email } = parseRemitente(c.remitente);
  const opciones = CATEGORIAS.includes(c.categoria) ? CATEGORIAS : [c.categoria, ...CATEGORIAS];

  return (
    <article
      aria-label={`Correo de ${nombre}: ${c.asunto}`}
      className={`relative overflow-hidden rounded-xl border bg-white p-4 pl-5 transition-all duration-200 hover:shadow-lg sm:p-5 sm:pl-6 dark:bg-slate-800 ${urgente ? "border-cuac-yellow-400 hover:border-cuac-yellow-500" : "border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600"}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${urgente ? "bg-cuac-yellow-500" : c.leido ? "bg-gray-200 dark:bg-slate-600" : "bg-cuac-blue-700"}`} aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <p className="truncate text-sm text-slate-600 dark:text-slate-400">
            <span className={c.leido ? "" : "font-semibold text-cuac-blue-900 dark:text-white"}>{nombre}</span>
            {nombre !== email && <span className="hidden sm:inline"> · {email}</span>}
          </p>
          <h3 className={`mt-0.5 text-base ${c.leido ? "font-medium text-slate-700 dark:text-slate-200" : "font-bold text-cuac-blue-900 dark:text-white"}`}>
            {!c.leido && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cuac-yellow-500 align-middle" role="img" aria-label="No leído" />}
            {c.asunto}
          </h3>
        </div>
        <time dateTime={c.fecha} className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{formatFecha(c.fecha)}</time>
      </div>

      {c.resumen && <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-700 dark:text-slate-300">{c.resumen}</p>}

      {c.estado === "rechazada" && c.motivo_rechazo && (
        <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300"><span className="font-semibold">Motivo del rechazo:</span> {c.motivo_rechazo}</p>
      )}

      {c.estado === "pendiente" && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-cuac-yellow-200 bg-cuac-yellow-50 p-3 dark:border-cuac-yellow-800 dark:bg-cuac-yellow-900/20">
          <p className="mr-auto text-sm font-medium text-cuac-yellow-900 dark:text-cuac-yellow-200">¿Se da trámite a esta solicitud?</p>
          <button onClick={() => onDecide(c, "aceptar")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cuac-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cuac-blue-700 dark:bg-cuac-blue-500 dark:hover:bg-cuac-blue-400">
            <Send className="h-4 w-4" aria-hidden /> Aceptar y enviar formulario
          </button>
          <button onClick={() => onDecide(c, "rechazar")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-400 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
            <XCircle className="h-4 w-4" aria-hidden /> Rechazar…
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CategoriaBadge categoria={c.categoria} />
        <PrioridadBadge prioridad={c.prioridad} />
        <EstadoBadge estado={c.estado} />
        {c.etiquetas && c.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {c.etiquetas.slice(0, 2).map((etiqueta) => (
              <span key={etiqueta} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-400">
                {etiqueta}
              </span>
            ))}
            {c.etiquetas.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-slate-500">+{c.etiquetas.length - 2}</span>
            )}
          </div>
        )}
        {c.asignado_a && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cuac-blue-100 px-2 py-0.5 text-xs text-cuac-blue-800 dark:bg-cuac-blue-900/30 dark:text-cuac-blue-300">
            <User className="h-3 w-3" aria-hidden />
            {c.asignado_a}
          </span>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {onViewDetail && (
            <button
              onClick={() => onViewDetail(c)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <Eye className="h-4 w-4" aria-hidden />
              Ver detalle
            </button>
          )}
          <label className="sr-only" htmlFor={`cat-${c.message_id}`}>Reclasificar correo</label>
          <select
            id={`cat-${c.message_id}`}
            value={c.categoria}
            disabled={busy}
            onChange={(e) => onUpdate(c.message_id, { categoria: e.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            {opciones.map((o) => <option key={o} value={o}>{capitalizar(o)}</option>)}
          </select>
          <button
            disabled={busy}
            onClick={() => onUpdate(c.message_id, { leido: !c.leido })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${c.leido ? "border border-gray-300 bg-white hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600" : "bg-cuac-blue-600 text-white hover:bg-cuac-blue-700 dark:bg-cuac-blue-500 dark:hover:bg-cuac-blue-400"}`}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
            {c.leido ? "Marcar no leído" : "Marcar leído"}
          </button>
        </div>
      </div>
    </article>
  );
}
