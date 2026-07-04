export type ApiErrorEnvelope = {
  error: string;
  message: string;
  ref: string;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly ref?: string;
  readonly details?: unknown;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    ref?: string;
    details?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.ref = params.ref;
    this.details = params.details;
  }
}

export function toUserMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === "UNAUTHENTICATED" || error.status === 401) {
      return "Please sign in before continuing.";
    }
    if (error.status === 403) {
      return "You do not have access to this action.";
    }
    if (error.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    return error.ref ? `${error.message} (ref: ${error.ref})` : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

