import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("app", () => {
  it("serves better-auth under /api/auth", async () => {
    const response = await app.request("/api/auth/ok");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects avatar uploads without a session", async () => {
    const response = await app.request("/api/avatars", {
      body: new FormData(),
      headers: { Origin: "http://localhost:3000" },
      method: "PUT",
    });

    expect(response.status).toBe(401);
  });

  it("rejects form posts from another origin", async () => {
    const response = await app.request("/api/avatars", {
      body: new FormData(),
      headers: { Origin: "https://evil.example" },
      method: "PUT",
    });

    expect(response.status).toBe(403);
  });
});
