import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_N8N_API_URL as string | undefined;
const apiKey = import.meta.env.VITE_N8N_API_KEY as string | undefined;
const keyHeader = (import.meta.env.VITE_N8N_API_KEY_HEADER as string | undefined) || "x-api-key";

export const isApiConfigured = Boolean(baseURL);

export const http = axios.create({
  baseURL: baseURL?.replace(/\/$/, ""),
  timeout: 20000,
  headers: { "Content-Type": "application/json", ...(apiKey ? { [keyHeader]: apiKey } : {}) },
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

http.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ message?: string }>) => {
    if (!err.response) throw new ApiError("No se pudo conectar con n8n. Revisa la URL, el CORS o que el flujo esté activo.");
    const s = err.response.status;
    if (s === 401 || s === 403) throw new ApiError("API key inválida o ausente.", s);
    if (s === 404) throw new ApiError("Webhook no encontrado. ¿Está activado el flujo (URL de producción)?", s);
    throw new ApiError(err.response.data?.message || `Error del servidor (${s}).`, s);
  },
);
