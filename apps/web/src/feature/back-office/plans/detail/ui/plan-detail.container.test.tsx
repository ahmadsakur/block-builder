import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { ApiError } from "@/lib/api";
import { deletePlan } from "../../_shared/service/plans.service";
import { getPlan, savePlanPermissions } from "../service/plan-detail.service";
import type { PlanDetail } from "../types/plan-detail.types";
import PlanDetailContainer from "./plan-detail.container";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("../service/plan-detail.service", () => ({
  getPlan: vi.fn(),
  savePlanPermissions: vi.fn(),
}));

vi.mock("../../_shared/service/plans.service", () => ({
  createPlan: vi.fn(),
  deletePlan: vi.fn(),
  updatePlan: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

let plan: PlanDetail;

beforeEach(() => {
  push.mockReset();
  plan = {
    description: "For small teams.",
    entitlements: resolveEntitlements([
      { key: "projects.max", enabled: false, limit: 5 },
    ]),
    id: "team",
    isDefault: false,
    members: 0,
    name: "Team",
    sort: 2,
  };
  vi.mocked(getPlan).mockImplementation(async () => plan);
  vi.mocked(savePlanPermissions).mockImplementation(
    async (_id, entitlements) => {
      plan = { ...plan, entitlements };
      return plan;
    },
  );
  vi.mocked(deletePlan).mockResolvedValue(undefined);
});

function renderDetail() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PlanDetailContainer planId="team" />
    </QueryClientProvider>,
  );
}

test("ticking a permission brings what it needs and saves both", async () => {
  const user = userEvent.setup();
  renderDetail();
  await user.click(
    await screen.findByRole(
      "checkbox",
      { name: /Export projects/ },
      LOAD_TIMEOUT,
    ),
  );
  expect(screen.getByRole("checkbox", { name: /^Projects/ })).toBeChecked();
  expect(screen.getByText("2 unsaved changes")).toBeInTheDocument();
  expect(screen.getByLabelText("Projects limit")).toHaveValue(5);

  await user.click(screen.getByRole("button", { name: "Save permissions" }));

  await vi.waitFor(() =>
    expect(vi.mocked(savePlanPermissions)).toHaveBeenCalledWith(
      "team",
      expect.objectContaining({
        "projects.export": { enabled: true, limit: 0 },
        "projects.max": { enabled: true, limit: 5 },
      }),
    ),
  );
  await vi.waitFor(() =>
    expect(screen.queryByText(/unsaved change/)).not.toBeInTheDocument(),
  );
}, 15000);

test("select all ticks a whole feature and the facts follow", async () => {
  const user = userEvent.setup();
  renderDetail();
  await user.click(
    await screen.findByRole(
      "button",
      { name: "Select all Projects permissions" },
      LOAD_TIMEOUT,
    ),
  );
  expect(screen.getByText("2 of 3")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Clear all Projects permissions" }),
  ).toBeInTheDocument();
});

test("a bad limit blocks saving with a reason", async () => {
  const user = userEvent.setup();
  renderDetail();
  await user.click(
    await screen.findByRole("checkbox", { name: /^Projects/ }, LOAD_TIMEOUT),
  );
  const limit = screen.getByLabelText("Projects limit");
  await user.clear(limit);
  await user.type(limit, "1.5");
  await user.click(screen.getByRole("button", { name: "Save permissions" }));

  expect(
    await screen.findByText("Projects: Use a whole number."),
  ).toBeInTheDocument();
  expect(vi.mocked(savePlanPermissions)).not.toHaveBeenCalled();
}, 15000);

test("deleting the plan confirms, then goes back to the list", async () => {
  const user = userEvent.setup();
  renderDetail();
  await user.click(
    await screen.findByRole(
      "button",
      { name: "More actions for Team" },
      LOAD_TIMEOUT,
    ),
  );
  await user.click(
    await screen.findByRole("menuitem", { name: "Delete plan" }),
  );
  await user.click(await screen.findByRole("button", { name: "Delete plan" }));

  await vi.waitFor(() =>
    expect(push).toHaveBeenCalledWith("/back-office/plans"),
  );
  expect(vi.mocked(deletePlan)).toHaveBeenCalledWith("team");
}, 15000);

test("the default plan has no delete", async () => {
  plan = { ...plan, id: "free", isDefault: true, name: "Free" };
  renderDetail();
  expect(
    await screen.findByText("Default plan", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "More actions for Free" }),
  ).not.toBeInTheDocument();
});

test("a missing plan says so", async () => {
  vi.mocked(getPlan).mockRejectedValue(
    new ApiError(404, { message: "This plan doesn't exist." }),
  );
  renderDetail();
  expect(
    await screen.findByText("This plan doesn't exist", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
});
