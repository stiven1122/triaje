import { http } from "./http";
import { USE_MOCK, mockDecidir, mockEstadisticas, mockGetCorreos, mockPatch } from "./mock";
import { normalizeCorreos, normalizeCorreo, normalizeEstadisticas } from "./adapters";
import type { Correo, CorreoPatch, Decision, CorreosFiltros, CorreosResponse, Estadisticas } from "../types";

export async function getCorreos(f: CorreosFiltros): Promise<CorreosResponse> {
  if (USE_MOCK) return mockGetCorreos(f);
  const page = f.page ?? 1;
  const params = { categoria: f.categoria ?? "", prioridad: f.prioridad ?? "", leido: f.leido ?? "", estado: f.estado ?? "", q: f.q ?? "", page };
  const { data } = await http.get("/correos", { params });
  return normalizeCorreos(data, page);
}

export async function getEstadisticas(): Promise<Estadisticas> {
  if (USE_MOCK) return mockEstadisticas();
  const { data } = await http.get("/estadisticas");
  return normalizeEstadisticas(data);
}

export async function patchCorreo(messageId: string, patch: CorreoPatch): Promise<Correo | null> {
  if (USE_MOCK) return mockPatch(messageId, patch);
  const { data } = await http.patch(`/correos/${encodeURIComponent(messageId)}`, patch);
  const item = Array.isArray(data) ? data[0] : (data?.data ?? data);
  return item?.message_id || item?.id ? normalizeCorreo(item) : null;
}

/** El coordinador acepta (n8n envía el formulario) o rechaza (n8n envía el correo con el motivo). */
export async function decidirCorreo(messageId: string, decision: Decision, motivo = ""): Promise<{ ok: boolean; estado: string }> {
  if (USE_MOCK) return mockDecidir(messageId, decision, motivo);
  const { data } = await http.post("/decision", { message_id: messageId, decision, motivo });
  return data;
}
