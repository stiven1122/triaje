export function formatFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso || "—";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}

export function capitalizar(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** "Ana Pérez <ana@x.com>" -> { nombre: "Ana Pérez", email: "ana@x.com" } */
export function parseRemitente(r: string): { nombre: string; email: string } {
  const m = r.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return { nombre: m[1] || m[2], email: m[2] };
  return { nombre: r, email: r };
}

export function tipoLabel(tipo?: string): string {
  return tipo === "SALIDA_TECNICA" ? "solicitud de salida técnica" : "propuesta de proyecto";
}
