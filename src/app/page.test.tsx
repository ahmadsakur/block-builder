import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

// Smoke test proving the Vitest + RTL wiring. Replace once the real home page lands.
test("renders the home heading", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});
