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

  it.each([
    ["GET", "/api/v1/root/users"],
    ["PATCH", "/api/v1/root/users/u1/plan"],
    ["GET", "/api/v1/root/plans"],
    ["POST", "/api/v1/root/plans"],
    ["GET", "/api/v1/root/plans/free"],
    ["PATCH", "/api/v1/root/plans/free"],
    ["DELETE", "/api/v1/root/plans/pro"],
    ["PUT", "/api/v1/root/plans/free/permissions"],
    ["GET", "/api/v1/user/entitlements"],
    ["GET", "/api/v1/user/plans"],
    ["GET", "/api/v1/user/projects"],
    ["POST", "/api/v1/user/projects"],
    ["DELETE", "/api/v1/user/projects/p1"],
    ["GET", "/api/v1/user/projects/export"],
    ["GET", "/api/v1/user/analytics"],
    ["GET", "/api/v1/root/unknown"],
  ])("rejects %s %s without a session", async (method, path) => {
    const response = await app.request(path, {
      headers: { Origin: "http://localhost:3000" },
      method,
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
