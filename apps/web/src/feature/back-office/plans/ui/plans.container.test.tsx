import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { listPlans } from "@/feature/back-office/_shared/service/plans.service";
import { createPlan, updatePlan } from "../service/plans.service";
import type { PlanRow } from "../types/plans.types";
import PlansContainer from "./plans.container";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/feature/back-office/_shared/service/plans.service", () => ({
  listPlans: vi.fn(),
}));

vi.mock("../service/plans.service", () => ({
  createPlan: vi.fn(),
  updatePlan: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

let plans: PlanRow[];

function row(patch: Partial<PlanRow>): PlanRow {
  return {
    description: "For trying things out.",
    entitlements: resolveEntitlements([]),
    faces: [],
    id: "free",
    isDefault: true,
    members: 1,
    name: "Free",
    sort: 0,
    ...patch,
  };
}

beforeEach(() => {
  push.mockReset();
  plans = [
    row({}),
    row({
      description: "For people who ship.",
      entitlements: resolveEntitlements([
        { key: "analytics.view", enabled: true, limit: null },
        { key: "projects.max", enabled: true, limit: 25 },
      ]),
      faces: [{ id: "u1", name: "Ana Lima" }],
      id: "pro",
      isDefault: false,
      members: 4,
      name: "Pro",
      sort: 1,
    }),
  ];
  vi.mocked(listPlans).mockImplementation(async () => plans);
  vi.mocked(updatePlan).mockImplementation(async (id, input) => {
    plans = plans.map((plan) =>
      plan.id === id ? { ...plan, ...input } : plan,
    );
    const saved = plans.find((plan) => plan.id === id);
    if (!saved) throw new Error("This plan doesn't exist.");
    return saved;
  });
  vi.mocked(createPlan).mockImplementation(async (input) => {
    const created = row({ ...input, id: "team", isDefault: false, sort: 2 });
    plans = [...plans, created];
    return created;
  });
});

function renderPlans() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PlansContainer />
    </QueryClientProvider>,
  );
}

test("lists plans with their users and permissions", async () => {
  renderPlans();
  expect(
    await screen.findByText("For people who ship.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Pro" })).toHaveAttribute(
    "href",
    "/back-office/plans/pro",
  );
  expect(screen.getByRole("link", { name: "4 users" })).toHaveAttribute(
    "href",
    "/back-office/users?plan=pro",
  );
  expect(screen.getByText("2 of 3")).toBeInTheDocument();
  expect(screen.getByText("Default")).toBeInTheDocument();
});

test("editing a plan saves the new name", async () => {
  const user = userEvent.setup();
  renderPlans();
  await user.click(
    await screen.findByRole("button", { name: "Edit Pro" }, LOAD_TIMEOUT),
  );
  const name = await screen.findByLabelText("Name");
  await user.clear(name);
  await user.type(name, "Pro Plus");
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(vi.mocked(updatePlan)).toHaveBeenCalledWith("pro", {
    description: "For people who ship.",
    name: "Pro Plus",
  });
  expect(
    await screen.findByRole("link", { name: "Pro Plus" }, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(push).not.toHaveBeenCalled();
}, 15000);

test("creating a plan opens it to pick permissions", async () => {
  const user = userEvent.setup();
  renderPlans();
  await user.click(
    await screen.findByRole("button", { name: "New plan" }, LOAD_TIMEOUT),
  );
  await user.type(await screen.findByLabelText("Name"), "Team");
  await user.click(screen.getByRole("button", { name: "Create plan" }));

  expect(vi.mocked(createPlan)).toHaveBeenCalledWith({
    description: "",
    name: "Team",
  });
  await vi.waitFor(() =>
    expect(push).toHaveBeenCalledWith("/back-office/plans/team"),
  );
}, 15000);

test("blocks an empty name", async () => {
  const user = userEvent.setup();
  renderPlans();
  await user.click(
    await screen.findByRole("button", { name: "Edit Free" }, LOAD_TIMEOUT),
  );
  await user.clear(await screen.findByLabelText("Name"));
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByText("Enter a plan name.")).toBeInTheDocument();
  expect(vi.mocked(updatePlan)).not.toHaveBeenCalled();
});
