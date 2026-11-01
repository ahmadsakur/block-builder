import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { listPlans } from "@/feature/back-office/_shared/service/plans.service";
import { ApiError } from "@/lib/api";
import {
  createPlan,
  deletePlan,
  updatePlan,
} from "../../_shared/service/plans.service";
import type { PlanRow } from "../../_shared/types/plans.types";
import PlansContainer from "./plans.container";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/feature/back-office/_shared/service/plans.service", () => ({
  listPlans: vi.fn(),
}));

vi.mock("../../_shared/service/plans.service", () => ({
  createPlan: vi.fn(),
  deletePlan: vi.fn(),
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
    members: 0,
    name: "Free",
    sort: 0,
    ...patch,
  };
}

beforeEach(() => {
  push.mockReset();
  plans = [
    row({ faces: [{ id: "u1", name: "Ana Lima" }], members: 1 }),
    row({
      description: "For people who ship.",
      entitlements: resolveEntitlements([
        { key: "analytics.view", enabled: true, limit: null },
        { key: "projects.max", enabled: true, limit: 25 },
      ]),
      faces: [{ id: "u2", name: "Bo Chen" }],
      id: "pro",
      isDefault: false,
      members: 4,
      name: "Pro",
      sort: 1,
    }),
    row({ description: "", id: "team", isDefault: false, name: "Team" }),
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
    const created = row({ ...input, id: "studio", isDefault: false });
    plans = [...plans, created];
    return created;
  });
  vi.mocked(deletePlan).mockImplementation(async (id) => {
    if (id === "pro") {
      throw new ApiError(409, {
        message: "Pro still has 4 users. Move them to another plan first.",
      });
    }
    plans = plans.filter((plan) => plan.id !== id);
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

async function openActions(name: string) {
  const user = userEvent.setup();
  renderPlans();
  await user.click(
    await screen.findByRole(
      "button",
      { name: `Actions for ${name}` },
      LOAD_TIMEOUT,
    ),
  );
  return user;
}

test("lists plans with their users and what they include", async () => {
  renderPlans();
  expect(
    await screen.findByRole("link", { name: "Pro" }, LOAD_TIMEOUT),
  ).toHaveAttribute("href", "/back-office/plans/pro");
  expect(
    screen.getByText(
      "3 plans with 5 users. Open one to choose what it includes.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Projects and Analytics")).toBeInTheDocument();
  expect(screen.getByText("2 of 3")).toBeInTheDocument();
  expect(
    screen.getByRole("list", { name: "4 users on Pro" }),
  ).toBeInTheDocument();
  expect(screen.getByText("+3")).toBeInTheDocument();
  expect(screen.getByText("Nobody yet")).toBeInTheDocument();
});

test("search narrows the list and offers to clear", async () => {
  const user = userEvent.setup();
  renderPlans();
  await user.type(
    await screen.findByRole(
      "searchbox",
      { name: "Search plans" },
      LOAD_TIMEOUT,
    ),
    "zzz",
  );
  expect(await screen.findByText("No matches")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Clear search" }));
  expect(await screen.findByRole("link", { name: "Pro" })).toBeInTheDocument();
});

test("creating a plan opens it to choose what it includes", async () => {
  const user = userEvent.setup();
  renderPlans();
  await user.click(
    await screen.findByRole("button", { name: "New plan" }, LOAD_TIMEOUT),
  );
  await user.type(await screen.findByLabelText("Name"), "Studio");
  await user.click(screen.getByRole("button", { name: "Create plan" }));

  expect(vi.mocked(createPlan)).toHaveBeenCalledWith({
    description: "",
    name: "Studio",
  });
  await vi.waitFor(() =>
    expect(push).toHaveBeenCalledWith("/back-office/plans/studio"),
  );
}, 15000);

test("editing details from the row menu saves the new name", async () => {
  const user = await openActions("Pro");
  await user.click(
    await screen.findByRole("menuitem", { name: "Edit details" }),
  );
  const name = await screen.findByLabelText("Name");
  await user.clear(name);
  await user.type(name, "Pro Plus");
  await user.click(screen.getByRole("button", { name: "Save" }));

  expect(vi.mocked(updatePlan)).toHaveBeenCalledWith("pro", {
    description: "For people who ship.",
    name: "Pro Plus",
  });
  expect(
    await screen.findByRole("link", { name: "Pro Plus" }, LOAD_TIMEOUT),
  ).toBeInTheDocument();
}, 15000);

test("the default plan has no delete action", async () => {
  const user = await openActions("Free");
  const menu = await screen.findByRole("menu");
  expect(
    within(menu).getByRole("menuitem", { name: "Edit permissions" }),
  ).toBeInTheDocument();
  expect(
    within(menu).queryByRole("menuitem", { name: "Delete" }),
  ).not.toBeInTheDocument();
  await user.keyboard("{Escape}");
});

test("deleting a plan with users shows why it can't", async () => {
  const user = await openActions("Pro");
  await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
  await user.click(await screen.findByRole("button", { name: "Delete plan" }));
  expect(
    await screen.findByText(
      "Pro still has 4 users. Move them to another plan first.",
    ),
  ).toBeInTheDocument();
}, 15000);

test("deleting an empty plan removes it", async () => {
  const user = await openActions("Team");
  await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
  await user.click(await screen.findByRole("button", { name: "Delete plan" }));
  await vi.waitFor(() =>
    expect(
      screen.queryByRole("link", { name: "Team" }),
    ).not.toBeInTheDocument(),
  );
  expect(vi.mocked(deletePlan)).toHaveBeenCalledWith("team");
}, 15000);
