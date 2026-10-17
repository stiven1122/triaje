/**
 * ÚNICO lugar que conoce la forma real de las respuestas de n8n.
 * Si tus webhooks devuelven otra estructura, ajusta SOLO este archivo.
 */
import type { Correo, CorreosResponse, Estadisticas, Estado, Prioridad } from "../types";

const ESTADOS = ["pendiente", "aceptada", "rechazada", "no_aplica"];

type Raw = Record<string, any>;
const PAGE_SIZE_DEFAULT = 10;

export function normalizeCorreo(r: Raw): Correo {
  const p = String(r.prioridad ?? "media").toLowerCase();
  return {
    message_id: String(r.message_id ?? r.id ?? ""),
    remitente: String(r.remitente ?? ""),
    asunto: String(r.asunto ?? "(sin asunto)"),
    resumen: String(r.resumen ?? ""),
    fecha: String(r.fecha ?? ""),
    categoria: String(r.categoria ?? "otros").toLowerCase(),
    prioridad: (["alta", "media", "baja"].includes(p) ? p : "media") as Prioridad,
    leido: r.leido === true || r.leido === "true" || r.leido === 1,
    estado: (ESTADOS.includes(r.estado) ? r.estado : "no_aplica") as Estado,
    tipo_solicitud: r.tipo_solicitud ?? undefined,
    rol: r.rol ?? undefined,
    motivo_rechazo: r.motivo_rechazo ?? null,
    fecha_decision: r.fecha_decision ?? null,
  };
}

/** Acepta: [..] | { data|items|correos: [..], total, page, pageSize, totalPages } */
export function normalizeCorreos(raw: any, page: number): CorreosResponse {
  const list: Raw[] = Array.isArray(raw) ? raw : (raw?.data ?? raw?.items ?? raw?.correos ?? []);
  const data = list.map(normalizeCorreo);
  const meta: Raw = Array.isArray(raw) ? {} : (raw ?? {});
  const pageSize = Number(meta.pageSize ?? meta.page_size ?? meta.limit ?? PAGE_SIZE_DEFAULT);
  const total = Number(meta.total ?? meta.count ?? data.length);
  const totalPages = Number(meta.totalPages ?? meta.total_pages ?? Math.max(1, Math.ceil(total / pageSize)));
  return { data, total, page: Number(meta.page ?? page), pageSize, totalPages };
}

function toRecord(x: any, key: string): Record<string, number> {
  if (!x) return {};
  if (Array.isArray(x)) {
    return Object.fromEntries(
      x.map((i: Raw) => [String(i[key] ?? "").toLowerCase(), Number(i.total ?? i.count ?? i.cantidad ?? 0)]),
    );
  }
  return Object.fromEntries(Object.entries(x).map(([k, v]) => [k.toLowerCase(), Number(v)]));
}

/** Acepta { total, por_categoria|porCategoria|categorias, por_prioridad|porPrioridad|prioridades } (objeto o array) */
export function normalizeEstadisticas(raw: any): Estadisticas {
  const r: Raw = Array.isArray(raw) ? (raw[0] ?? {}) : (raw ?? {});
  const porCategoria = toRecord(r.por_categoria ?? r.porCategoria ?? r.categorias, "categoria");
  const porPrioridad = toRecord(r.por_prioridad ?? r.porPrioridad ?? r.prioridades, "prioridad");
  const porEstado = toRecord(r.por_estado ?? r.porEstado ?? r.estados, "estado");
  const total = Number(r.total ?? Object.values(porCategoria).reduce((a, b) => a + b, 0));
  return { total, porCategoria, porPrioridad, porEstado };
}
