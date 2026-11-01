import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserIcon } from "lucide-react";
import { beforeEach, expect, test, vi } from "vitest";
import UserMenu from "./user-menu";

const push = vi.fn();
const mutate = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/auth/session-query", () => ({
  useSessionQuery: () => ({
    data: {
      user: { avatarUrl: null, email: "ana@example.com", name: "Ana Lima" },
    },
    isPending: false,
  }),
  useSignOut: () => ({ isPending: false, mutate, reset: vi.fn() }),
}));

beforeEach(() => {
  push.mockReset();
  mutate.mockReset();
});

const LINKS = [
  { href: "/dashboard/profile", icon: <UserIcon />, title: "Profile" },
];

async function openMenu() {
  const user = userEvent.setup();
  render(<UserMenu links={LINKS} />);
  await user.click(screen.getByRole("button", { name: /account: Ana Lima/ }));
  return user;
}

test("the avatar opens the account menu with name, email and profile", async () => {
  await openMenu();
  expect(await screen.findByText("ana@example.com")).toBeInTheDocument();
  expect(screen.getByText("Ana Lima")).toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveAttribute(
    "href",
    "/dashboard/profile",
  );
});

test("signing out asks first, then signs out and goes to sign-in", async () => {
  const user = await openMenu();
  await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));

  expect(
    await screen.findByRole("alertdialog", { name: "Sign out?" }),
  ).toBeInTheDocument();
  expect(mutate).not.toHaveBeenCalled();

  mutate.mockImplementation((_, options) => options.onSuccess());
  await user.click(screen.getByRole("button", { name: "Sign out" }));
  expect(mutate).toHaveBeenCalled();
  expect(push).toHaveBeenCalledWith("/sign-in");
});

test("cancel keeps the session", async () => {
  const user = await openMenu();
  await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));
  await user.click(await screen.findByRole("button", { name: "Cancel" }));
  expect(mutate).not.toHaveBeenCalled();
});
