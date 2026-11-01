import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ProLock from "./pro-lock";

test("a locked element is made inert and wears a Pro badge", () => {
  render(
    <ProLock locked>
      <button type="button">Export</button>
    </ProLock>,
  );

  const button = screen.getByRole("button", { name: "Export" });
  expect(button.closest("[inert]")).not.toBeNull();
  expect(screen.getByText("Pro")).toBeInTheDocument();
});

test("an unlocked element renders as it is", () => {
  render(
    <ProLock locked={false}>
      <button type="button">Export</button>
    </ProLock>,
  );

  expect(
    screen.getByRole("button", { name: "Export" }).closest("[inert]"),
  ).toBeNull();
  expect(screen.queryByText("Pro")).not.toBeInTheDocument();
});
