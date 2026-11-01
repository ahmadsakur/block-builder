import { expect, test } from "vitest";
import { type AreaNav, areaBreadcrumbs } from "./area-nav";

const NAV: AreaNav = {
  account: [],
  root: { href: "/back-office", label: "Back office" },
  sections: [
    { items: [{ href: "/back-office/plans", icon: null, title: "Plans" }] },
  ],
};

test("names a nav page", () => {
  expect(areaBreadcrumbs(NAV, "/back-office/plans")).toEqual([
    NAV.root,
    { label: "Plans" },
  ]);
});

test("links back to the nav page above a nested page", () => {
  expect(areaBreadcrumbs(NAV, "/back-office/plans/pro")).toEqual([
    NAV.root,
    { href: "/back-office/plans", label: "Plans" },
    { label: "Details" },
  ]);
});

test("falls back for unknown pages", () => {
  expect(areaBreadcrumbs(NAV, "/back-office/other")).toEqual([
    NAV.root,
    { label: "Page" },
  ]);
});
