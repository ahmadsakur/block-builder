import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

// Smoke test proving the Vitest + RTL wiring. Replace once the real home page lands.
test("renders the home heading and links", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open dashboard" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
  expect(
    screen.getByRole("link", { name: "View design tokens" }),
  ).toHaveAttribute("href", "/tokens");
});
