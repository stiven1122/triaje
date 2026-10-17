/** MODO DEMOSTRACIÓN (VITE_USE_MOCK=true): datos de ejemplo en memoria, sin n8n. Solo para desarrollo/demos. */
import { ApiError } from "./http";
import type { Correo, CorreoPatch, CorreosFiltros, CorreosResponse, Decision, Estadisticas } from "../types";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const PAGE_SIZE = 5;
const hace = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const wait = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 350));

const c = (i: number, remitente: string, asunto: string, resumen: string, h: number, categoria: string,
  prioridad: Correo["prioridad"], estado: Correo["estado"] = "no_aplica", tipo?: string, leido = false): Correo =>
  ({ message_id: `demo-${i}`, remitente, asunto, resumen, fecha: hace(h), categoria, prioridad, leido, estado, tipo_solicitud: tipo, rol: tipo ? "Docente" : undefined });

let db: Correo[] = [
  c(1, "Carlos Muñoz <carlos@uni.edu>", "Propuesta de proyecto: Plataforma de laboratorios", "Propone una plataforma web para reservar laboratorios el próximo semestre.", 1, "académico", "media", "pendiente", "PROYECTO"),
  c(2, "Marta Ruiz <marta@uni.edu>", "Solicitud de salida técnica a empresa de software", "Transporte para 25 estudiantes de séptimo semestre.", 3, "académico", "media", "pendiente", "SALIDA_TECNICA"),
  c(3, "Vicerrectoría Académica <vice@uni.edu>", "Nuevo proyecto institucional de investigación", "Solicita iniciar un proyecto institucional.", 5, "administrativo", "alta", "pendiente", "PROYECTO"),
  c(4, "Rectoría <rectoria@uni.edu>", "Reunión urgente de coordinadores", "Se convoca para mañana a las 8:00 a. m.", 7, "urgente", "alta"),
  c(5, "Ana Gómez <ana@uni.edu>", "Entrega del informe final", "Confirma la fecha de entrega del informe.", 20, "urgente", "alta", "no_aplica", undefined, true),
  c(6, "Luis Pérez <luis@uni.edu>", "Propuesta de proyecto de grado", "Idea de proyecto de grado en IoT.", 30, "académico", "media", "aceptada", "PROYECTO", true),
  c(7, "Tienda Tech <ofertas@shop.com>", "50% de descuento en licencias", "Promoción de la semana.", 40, "promociones", "baja", "no_aplica", undefined, true),
  c(8, "Secretaría <secretaria@uni.edu>", "Actualización de datos administrativos", "Recordatorio para actualizar datos.", 50, "administrativo", "media"),
  c(9, "Pedro Díaz <pedro@uni.edu>", "Salida técnica a data center", "Solicitud fuera del presupuesto.", 60, "académico", "media", "rechazada", "SALIDA_TECNICA", true),
  c(10, "Boletín <news@revista.com>", "Novedades de la semana", "Resumen de noticias del sector.", 70, "promociones", "baja", "no_aplica", undefined, true),
  c(11, "Desconocido <x@correo.com>", "Consulta general", "Pregunta sin relación con proyectos.", 80, "otros", "media"),
  c(12, "Bienestar <bienestar@uni.edu>", "Jornada de salud", "Invitación a la jornada.", 90, "otros", "baja", "no_aplica", undefined, true),
];
db[8].motivo_rechazo = "El costo solicitado excede el presupuesto base disponible.";

export const mockGetCorreos = (f: CorreosFiltros): Promise<CorreosResponse> => {
  const q = (f.q ?? "").toLowerCase();
  const rows = db.filter((x) =>
    (!f.categoria || x.categoria === f.categoria) && (!f.prioridad || x.prioridad === f.prioridad) &&
    (!f.leido || x.leido === (f.leido === "true")) && (!f.estado || x.estado === f.estado) &&
    (!q || x.remitente.toLowerCase().includes(q) || x.asunto.toLowerCase().includes(q)))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const page = f.page ?? 1;
  return wait({ data: rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: rows.length, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(rows.length / PAGE_SIZE)) });
};

export const mockEstadisticas = (): Promise<Estadisticas> => {
  const count = (k: keyof Correo) => db.reduce<Record<string, number>>((a, x) => ({ ...a, [String(x[k])]: (a[String(x[k])] ?? 0) + 1 }), {});
  return wait({ total: db.length, porCategoria: count("categoria"), porPrioridad: count("prioridad"), porEstado: count("estado") });
};

export const mockPatch = (id: string, patch: CorreoPatch): Promise<Correo | null> => {
  db = db.map((x) => (x.message_id === id ? { ...x, ...patch } : x));
  return wait(db.find((x) => x.message_id === id) ?? null);
};

export const mockDecidir = async (id: string, decision: Decision, motivo: string) => {
  const x = db.find((m) => m.message_id === id);
  if (!x || x.estado !== "pendiente") throw new ApiError("La solicitud no existe, ya fue decidida o no admite decisión.", 409);
  db = db.map((m) => (m.message_id === id ? { ...m, estado: decision === "aceptar" ? "aceptada" : "rechazada", motivo_rechazo: decision === "rechazar" ? motivo : null } : m));
  return wait({ ok: true, estado: decision === "aceptar" ? "aceptada" : "rechazada" });
};
