import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { AuthUser } from "../../../_shared/types/auth.types";
import ProfileForm from "./profile-form";

const USER: AuthUser = {
  email: "jane@acme.com",
  id: "user-jane",
  name: "Jane Doe",
  role: "user",
};

test("keeps save disabled until something changes", async () => {
  const user = userEvent.setup();
  render(<ProfileForm user={USER} pending={false} onSubmit={vi.fn()} />);

  const save = screen.getByRole("button", { name: "Save profile" });
  expect(save).toBeDisabled();

  await user.type(screen.getByLabelText("Full name"), "s");
  expect(save).toBeEnabled();
  expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
});

test("submits the edited profile", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ProfileForm user={USER} pending={false} onSubmit={onSubmit} />);

  const name = screen.getByLabelText("Full name");
  await user.clear(name);
  await user.type(name, "Jane Smith");
  await user.click(screen.getByRole("button", { name: "Save profile" }));

  expect(onSubmit).toHaveBeenCalledWith(
    { email: "jane@acme.com", name: "Jane Smith" },
    expect.anything(),
  );
});

test("blocks an invalid email", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ProfileForm user={USER} pending={false} onSubmit={onSubmit} />);

  const email = screen.getByLabelText("Email");
  await user.clear(email);
  await user.type(email, "not-an-email");
  await user.click(screen.getByRole("button", { name: "Save profile" }));

  expect(
    await screen.findByText("Enter a valid email address."),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});
