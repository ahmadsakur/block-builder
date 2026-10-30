import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import ProfileContainer from "./profile.container";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(async () => ({
    user: {
      email: "jane@acme.com",
      id: "user-1",
      name: "Jane Doe",
      role: "user",
    },
  })),
}));

vi.mock("../service/profile.service", () => ({
  changePassword: vi.fn(async () => {
    throw new Error("Your current password is incorrect.");
  }),
  deleteAccount: vi.fn(),
  removeAvatar: vi.fn(),
  updateProfile: vi.fn(),
  uploadAvatar: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

function renderProfile() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ProfileContainer />
    </QueryClientProvider>,
  );
}

test("shows a skeleton, then the signed-in user's details", async () => {
  renderProfile();
  expect(
    screen.getByRole("status", { name: "Loading your profile" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByLabelText("Full name", {}, LOAD_TIMEOUT),
  ).toHaveValue("Jane Doe");
});

const SLOW_TEST_MS = 15000;

test(
  "a wrong current password shows the server error",
  async () => {
    const user = userEvent.setup();
    renderProfile();
    await screen.findByLabelText("Current password", {}, LOAD_TIMEOUT);

    await user.type(
      screen.getByLabelText("Current password"),
      "wrong-password",
    );
    await user.type(screen.getByLabelText("New password"), "new-password-1");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "new-password-1",
    );
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      await screen.findByText(
        "Your current password is incorrect.",
        {},
        LOAD_TIMEOUT,
      ),
    ).toBeInTheDocument();
  },
  SLOW_TEST_MS,
);

test("mismatched new passwords are caught before submit", async () => {
  const user = userEvent.setup();
  renderProfile();
  await screen.findByLabelText("Current password", {}, LOAD_TIMEOUT);

  await user.type(screen.getByLabelText("Current password"), "secret-123");
  await user.type(screen.getByLabelText("New password"), "new-password-1");
  await user.type(
    screen.getByLabelText("Confirm new password"),
    "new-password-2",
  );
  await user.click(screen.getByRole("button", { name: "Update password" }));

  expect(await screen.findByText("Passwords don't match.")).toBeInTheDocument();
});
