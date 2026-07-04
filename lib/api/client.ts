import { env } from "@/config/env";
import { ApiError, type ApiErrorEnvelope } from "./errors";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
  parseJson?: boolean;
  beforeRequest?: (request: Request) => void | Promise<void>;
  afterResponse?: (response: Response) => void | Promise<void>;
  onApiError?: (error: ApiError) => void | Promise<void>;
};

function createCorrelationId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `cid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${env.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError({
      status: response.status,
      code: "INVALID_JSON",
      message: "The server returned an invalid response.",
    });
  }
}

function toApiError(response: Response, payload: unknown) {
  const envelope = payload as Partial<ApiErrorEnvelope> | null;
  return new ApiError({
    status: response.status,
    code: typeof envelope?.error === "string" ? envelope.error : "HTTP_ERROR",
    message:
      typeof envelope?.message === "string"
        ? envelope.message
        : `Request failed with status ${response.status}`,
    ref: typeof envelope?.ref === "string" ? envelope.ref : undefined,
    details: envelope?.details,
  });
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    body,
    timeoutMs = 15_000,
    parseJson = true,
    beforeRequest,
    afterResponse,
    onApiError,
    headers,
    ...init
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  requestHeaders.set("X-Correlation-ID", createCorrelationId());

  const hasBody = body !== undefined;
  if (hasBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const request = new Request(getUrl(path), {
    ...init,
    credentials: "include",
    headers: requestHeaders,
    body: hasBody ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  });

  try {
    await beforeRequest?.(request);
    const response = await fetch(request);
    await afterResponse?.(response);
    const payload = parseJson ? await readJson(response) : null;

    if (!response.ok) {
      const error = toApiError(response, payload);
      await onApiError?.(error);
      throw error;
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        status: 0,
        code: "REQUEST_TIMEOUT",
        message: "The request timed out.",
      });
    }

    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Unable to reach the API.",
      details: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}
