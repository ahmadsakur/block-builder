import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import SignInForm from "./sign-in-form";

test("shows field errors and blocks an empty submit", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<SignInForm pending={false} onSubmit={onSubmit} />);

  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByText("Enter a valid email address."),
  ).toBeInTheDocument();
  expect(screen.getByText("Enter your password.")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("submits valid values", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<SignInForm pending={false} onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Email"), "jane@acme.com");
  await user.type(screen.getByLabelText("Password"), "correct-horse");
  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(onSubmit).toHaveBeenCalledWith(
    { email: "jane@acme.com", password: "correct-horse" },
    expect.anything(),
  );
});

test("shows the server error", () => {
  render(
    <SignInForm
      pending={false}
      error="That email and password don't match."
      onSubmit={vi.fn()}
    />,
  );
  expect(
    screen.getByText("That email and password don't match."),
  ).toBeInTheDocument();
});
