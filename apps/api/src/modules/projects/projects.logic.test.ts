import { describe, expect, test } from "vitest";
import { projectsCsv } from "./projects.logic";

describe("projectsCsv", () => {
  test("quotes commas and neutralises formula cells", () => {
    expect(
      projectsCsv([
        { createdAt: "2026-10-31T00:00:00.000Z", id: "p1", name: "Site, v2" },
        { createdAt: "2026-10-31T00:00:00.000Z", id: "p2", name: "=SUM(A1)" },
      ]),
    ).toBe(
      'id,name,createdAt\np1,"Site, v2",2026-10-31T00:00:00.000Z\np2,\'=SUM(A1),2026-10-31T00:00:00.000Z\n',
    );
  });
});
