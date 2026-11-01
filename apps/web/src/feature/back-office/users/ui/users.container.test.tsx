import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, expect, test, vi } from "vitest";
import { listUsers, setUserPlan } from "../service/users.service";
import type { ManagedUser, UserListQuery } from "../types/users.types";
import UsersContainer from "./users.container";

vi.mock("../service/users.service", () => ({
  listUsers: vi.fn(),
  setUserPlan: vi.fn(),
}));

vi.mock("@/feature/back-office/_shared/service/plans.service", () => ({
  listPlans: vi.fn(async () => [
    {
      description: "",
      entitlements: {},
      faces: [],
      id: "free",
      isDefault: true,
      members: 1,
      name: "Free",
      sort: 0,
    },
    {
      description: "",
      entitlements: {},
      faces: [],
      id: "pro",
      isDefault: false,
      members: 1,
      name: "Pro",
      sort: 1,
    },
  ]),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

let users: ManagedUser[];

function user(patch: Partial<ManagedUser>): ManagedUser {
  return {
    banned: false,
    createdAt: "2026-10-31T10:00:00.000Z",
    email: "ana@example.com",
    emailVerified: true,
    id: "u1",
    name: "Ana",
    plan: "free",
    ...patch,
  };
}

beforeEach(() => {
  users = [
    user({}),
    user({ email: "bo@example.com", id: "u2", name: "Bo", plan: "pro" }),
  ];
  vi.mocked(listUsers).mockImplementation(async (query: UserListQuery) => {
    const rows = users.filter(
      (row) =>
        (query.plan.length === 0 || query.plan.includes(row.plan)) &&
        row.name.toLowerCase().includes(query.search.toLowerCase()),
    );
    return { facets: { plan: { free: 1, pro: 1 } }, rows, total: rows.length };
  });
  vi.mocked(setUserPlan).mockImplementation(async (id, input) => {
    users = users.map((row) => (row.id === id ? { ...row, ...input } : row));
    const saved = users.find((row) => row.id === id);
    if (!saved) throw new Error("This user no longer exists.");
    return saved;
  });
});

function renderUsers(searchParams = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <NuqsTestingAdapter searchParams={searchParams} hasMemory>
      <QueryClientProvider client={client}>
        <UsersContainer />
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
}

test("lists users with their plan", async () => {
  renderUsers();
  expect(
    await screen.findByText("2 users match.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getByText("bo@example.com")).toBeInTheDocument();
  expect(screen.getByText("Pro")).toBeInTheDocument();
});

test("the plan filter from the URL reaches the API query", async () => {
  renderUsers("?plan=pro");
  expect(
    await screen.findByText("1 user match.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(vi.mocked(listUsers)).toHaveBeenLastCalledWith(
    expect.objectContaining({ plan: ["pro"] }),
  );
});

test("change plan saves through the API and refreshes the row", async () => {
  const user = userEvent.setup();
  renderUsers();
  await screen.findByText("2 users match.", {}, LOAD_TIMEOUT);

  await user.click(screen.getByRole("button", { name: "Actions for Ana" }));
  await user.click(
    await screen.findByRole("menuitem", { name: "Change plan" }),
  );
  expect(
    await screen.findByText("Ana (ana@example.com) is on Free."),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("combobox", { name: "Plan" }));
  await user.click(await screen.findByRole("option", { name: "Pro" }));
  await user.click(screen.getByRole("button", { name: "Change plan" }));

  expect(vi.mocked(setUserPlan)).toHaveBeenCalledWith("u1", { plan: "pro" });
  expect(await screen.findAllByText("Pro", {}, LOAD_TIMEOUT)).toHaveLength(2);
}, 15000);

test("a failed load offers to try again", async () => {
  vi.mocked(listUsers).mockRejectedValueOnce(new Error("down"));
  renderUsers();
  expect(
    await screen.findByText("Users didn't load", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Try again" }));
  expect(
    await screen.findByText("2 users match.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
});
