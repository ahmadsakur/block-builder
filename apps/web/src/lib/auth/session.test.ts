import { describe, expect, test } from "vitest";
import { toSession } from "./session";

describe("toSession", () => {
  test("maps the better-auth image to avatarUrl and keeps the role", () => {
    expect(
      toSession({
        email: "a@b.co",
        id: "1",
        image: "/a.png",
        name: "Ana",
        role: "root",
      }),
    ).toEqual({
      user: {
        avatarUrl: "/a.png",
        email: "a@b.co",
        id: "1",
        name: "Ana",
        role: "root",
      },
    });
  });

  test("leaves avatarUrl out and defaults the role", () => {
    expect(
      toSession({ email: "a@b.co", id: "1", image: null, name: "Ana" }),
    ).toEqual({
      user: { email: "a@b.co", id: "1", name: "Ana", role: "user" },
    });
  });
});
