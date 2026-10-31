import { afterEach, describe, expect, test, vi } from "vitest";
import { ApiError, api, isAccessError } from "./api";

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("api", () => {
  test("sends JSON and returns the parsed body", async () => {
    const fetchMock = mockFetch(Response.json({ id: "p1" }, { status: 201 }));

    await expect(
      api("/api/v1/user/projects", { json: { name: "A" }, method: "POST" }),
    ).resolves.toEqual({ id: "p1" });
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/user/projects", {
      body: '{"name":"A"}',
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  });

  test("returns undefined for 204", async () => {
    mockFetch(new Response(null, { status: 204 }));

    await expect(api("/x", { method: "DELETE" })).resolves.toBeUndefined();
  });

  test("throws an ApiError carrying the access code", async () => {
    mockFetch(
      Response.json(
        {
          code: "LIMIT_REACHED",
          message: "Your plan allows 3 projects. Upgrade for more.",
          permission: "projects.max",
        },
        { status: 403 },
      ),
    );

    const error = await api("/x").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect(isAccessError(error)).toBe(true);
    expect((error as ApiError).message).toBe(
      "Your plan allows 3 projects. Upgrade for more.",
    );
    expect((error as ApiError).body.permission).toBe("projects.max");
  });

  test("falls back to a generic message when the body isn't JSON", async () => {
    mockFetch(new Response("boom", { status: 500 }));

    const error = await api("/x").catch((caught: unknown) => caught);
    expect(isAccessError(error)).toBe(false);
    expect((error as ApiError).message).toBe(
      "Something went wrong. Try again.",
    );
  });
});
