import type { ApiErrorBody } from "@block-builder/shared/api";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";

export function httpError(
  status: ContentfulStatusCode,
  body: ApiErrorBody,
): HTTPException {
  return new HTTPException(status, { res: Response.json(body, { status }) });
}

export function parse<T extends z.ZodType>(
  schema: T,
  value: unknown,
): z.infer<T> {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  throw httpError(400, {
    message: result.error.issues[0]?.message ?? "Check the request.",
  });
}

export async function readJson(request: Request): Promise<unknown> {
  return request.json().catch(() => {
    throw httpError(400, { message: "Send a JSON body." });
  });
}
