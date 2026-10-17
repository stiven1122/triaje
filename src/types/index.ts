export type Prioridad = "alta" | "media" | "baja";
export type Estado = "pendiente" | "aceptada" | "rechazada" | "no_aplica";
export type Decision = "aceptar" | "rechazar";

export interface Correo {
  message_id: string;
  remitente: string;
  asunto: string;
  resumen: string;
  fecha: string;
  categoria: string;
  prioridad: Prioridad;
  leido: boolean;
  /** Ampliación del modelo: ciclo de decisión del coordinador */
  estado: Estado;
  tipo_solicitud?: string;
  rol?: string;
  motivo_rechazo?: string | null;
  fecha_decision?: string | null;
  /** Etiquetas personalizadas */
  etiquetas?: string[];
  /** Persona responsable asignada */
  asignado_a?: string | null;
  /** Comentarios internos */
  comentarios?: Comentario[];
}

export interface Comentario {
  id: string;
  texto: string;
  autor: string;
  fecha: string;
}

export interface CorreosFiltros {
  categoria?: string;
  prioridad?: Prioridad | "";
  leido?: "true" | "false" | "";
  estado?: Estado | "";
  q?: string;
  page?: number;
}

export interface CorreosResponse {
  data: Correo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Estadisticas {
  total: number;
  porCategoria: Record<string, number>;
  porPrioridad: Record<string, number>;
  porEstado: Record<string, number>;
  tiempoPromedioRespuesta?: number; // en horas
  tasaResolucion?: number; // porcentaje
  porAsignado?: Record<string, number>;
  porPrograma?: Record<string, number>;
}

export type CorreoPatch = Partial<Pick<Correo, "leido" | "categoria" | "prioridad" | "etiquetas" | "asignado_a">>;
