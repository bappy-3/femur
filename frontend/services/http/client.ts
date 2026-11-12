import { env } from "@/config/env";

/** Normalised API error (RFC 7807 problem details from the backend). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors: { field: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

type Query = Record<string, string | number | boolean | null | undefined | string[]>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  query?: Query;
  body?: unknown;
  /** Next.js fetch cache options for server-side reads. */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
  /** Forwarded Cookie header for server-side authenticated calls. */
  cookieHeader?: string;
  idempotencyKey?: string;
}

const API_BASE = `${env.apiUrl}/api/v1`;

function buildUrl(path: string, query?: Query) {
  const url = new URL(`${API_BASE}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, v));
      else url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function readCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("femur_csrf="))
    ?.split("=")[1];
}

/** Single entry point for HTTP calls to the Femur backend. Unwraps `{ data }` envelopes. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", query, body, next, cache, cookieHeader, idempotencyKey } = options;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (cookieHeader) headers.Cookie = cookieHeader;
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  if (method !== "GET") {
    const csrf = readCsrfToken();
    if (csrf) headers["X-CSRF-Token"] = csrf;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      cache,
      next,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "We couldn't reach the server. Please check your connection and try again.");
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.code ?? "UNKNOWN_ERROR",
      payload?.detail ?? payload?.title ?? "Something went wrong. Please try again.",
      payload?.errors ?? [],
    );
  }
  return (payload && typeof payload === "object" && "data" in payload ? payload.data : payload) as T;
}
