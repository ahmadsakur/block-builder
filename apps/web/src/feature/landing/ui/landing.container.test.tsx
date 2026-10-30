import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import LandingContainer from "./landing.container";

test("renders the heading and entry links", () => {
  render(<LandingContainer />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open dashboard" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
  expect(
    screen.getByRole("link", { name: "View design tokens" }),
  ).toHaveAttribute("href", "/tokens");
});
