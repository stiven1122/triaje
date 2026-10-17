import { useEffect, useRef, useState } from "react";
import { Loader2, Send, XCircle } from "lucide-react";
import { tipoLabel } from "../utils/format";
import type { Correo, Decision } from "../types";

interface Props {
  correo: Correo;
  modo: Decision;
  pending: boolean;
  error: string | null;
  onConfirm: (motivo: string) => void;
  onClose: () => void;
}

const MIN = 10;
const MAX = 1000;

export default function DecisionDialog({ correo, modo, pending, error, onConfirm, onClose }: Props) {
  const [motivo, setMotivo] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const rechazar = modo === "rechazar";
  const valido = !rechazar || motivo.trim().length >= MIN;
  const tipo = tipoLabel(correo.tipo_solicitud);

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("textarea, [data-primary]")?.focus();
    return () => previo?.focus?.();
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>("button:not([disabled]), textarea:not([disabled])"));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [pending, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => !pending && onClose()} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-desc"
        className="relative w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-xl dark:bg-slate-800 sm:rounded-2xl">
        <h2 id="dlg-title" className="text-lg font-bold text-slate-900 dark:text-white">
          {rechazar ? "Rechazar solicitud" : "Aceptar solicitud y enviar formulario"}
        </h2>
        <p id="dlg-desc" className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          {rechazar
            ? <>Se enviará un correo al solicitante informando que su {tipo} «{correo.asunto}» fue rechazada, junto con el motivo que escribas.</>
            : <>Se enviará por correo al solicitante el formulario de {tipo} para «{correo.asunto}». Esta acción no se puede deshacer.</>}
        </p>

        {rechazar && (
          <div className="mt-4">
            <label htmlFor="motivo" className="text-sm font-semibold text-slate-900 dark:text-white">Motivo del rechazo</label>
            <textarea id="motivo" rows={4} maxLength={MAX} value={motivo} onChange={(e) => setMotivo(e.target.value)}
              disabled={pending} aria-describedby="motivo-ayuda"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200" placeholder="Explica brevemente por qué no se acepta…" />
            <p id="motivo-ayuda" className={`mt-1 text-xs ${valido ? "text-slate-500 dark:text-slate-400" : "text-red-700 dark:text-red-400"}`}>
              Mínimo {MIN} caracteres · {motivo.trim().length}/{MAX}
            </p>
          </div>
        )}

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} disabled={pending} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
            Cancelar
          </button>
          <button data-primary onClick={() => onConfirm(motivo.trim())} disabled={pending || !valido}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${rechazar ? "bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600" : "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"}`}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : rechazar ? <XCircle className="h-4 w-4" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
            {pending ? "Enviando…" : rechazar ? "Rechazar y enviar correo" : "Aceptar y enviar formulario"}
          </button>
        </div>
      </div>
    </div>
  );
}
