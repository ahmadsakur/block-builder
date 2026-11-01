import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import ProRequiredContainer from "./pro-required.container";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

beforeEach(() => push.mockReset());

test("shows only the Pro dialog with a way home", () => {
  render(<ProRequiredContainer />);

  expect(
    screen.getByRole("dialog", { name: "This page is on Pro" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
});

test("closing the dialog goes home", async () => {
  render(<ProRequiredContainer />);
  await userEvent.setup().keyboard("{Escape}");
  expect(push).toHaveBeenCalledWith("/dashboard");
});
