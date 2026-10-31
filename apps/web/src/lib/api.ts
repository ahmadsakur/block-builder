import type { ApiErrorBody } from "@block-builder/shared/api";

const FALLBACK_MESSAGE = "Something went wrong. Try again.";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message || FALLBACK_MESSAGE);
  }
}

type ApiInit = Omit<RequestInit, "body"> & { json?: unknown };

async function send(path: string, init: ApiInit): Promise<Response> {
  const { json, headers, ...rest } = init;
  const response = await fetch(path, {
    ...rest,
    ...(json === undefined
      ? { headers }
      : {
          body: JSON.stringify(json),
          headers: { "Content-Type": "application/json", ...headers },
        }),
  });
  if (response.ok) return response;
  const body: Partial<ApiErrorBody> = await response.json().catch(() => ({}));
  throw new ApiError(response.status, {
    ...body,
    message: body.message || FALLBACK_MESSAGE,
  });
}

export async function api<T = void>(
  path: string,
  init: ApiInit = {},
): Promise<T> {
  const response = await send(path, init);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function apiBlob(path: string, init: ApiInit = {}): Promise<Blob> {
  return (await send(path, init)).blob();
}

export function isAccessError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.body.code !== undefined;
}
