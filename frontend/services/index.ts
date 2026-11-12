import { isMockMode } from "@/config/env";
import { liveApi } from "./api";
import type { FemurApi } from "./contracts";
import { mockApi } from "./mock";

/**
 * The single data-access entry point for the whole frontend.
 * `NEXT_PUBLIC_API_MODE=live` → NestJS backend; `mock` → in-memory sample data (dev only).
 */
export const api: FemurApi = isMockMode ? mockApi : liveApi;

export { ApiError, isApiError } from "./http/client";
export type { FemurApi } from "./contracts";
