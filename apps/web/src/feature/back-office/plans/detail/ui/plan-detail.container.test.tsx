import { resolveEntitlements } from "@block-builder/shared/entitlements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { ApiError } from "@/lib/api";
import {
  deletePlan,
  getPlan,
  savePlanPermissions,
} from "../service/plan-detail.service";
import type { PlanDetail } from "../types/plan-detail.types";
import PlanDetailContainer from "./plan-detail.container";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("../service/plan-detail.service", () => ({
  deletePlan: vi.fn(),
  getPlan: vi.fn(),
  savePlanPermissions: vi.fn(),
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
    members: 2,
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

test("turning on export also turns on projects and saves both", async () => {
  const user = userEvent.setup();
  renderDetail();
  await user.click(
    await screen.findByRole(
      "switch",
      { name: "Export projects" },
      LOAD_TIMEOUT,
    ),
  );
  expect(screen.getByRole("switch", { name: "Projects" })).toBeChecked();
  expect(screen.getByText("2 unsaved changes")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Save changes" }));

  await vi.waitFor(() =>
    expect(vi.mocked(savePlanPermissions)).toHaveBeenCalledWith(
      "team",
      expect.objectContaining({
        "projects.export": { enabled: true, limit: 0 },
        "projects.max": { enabled: true, limit: 5 },
      }),
    ),
  );
}, 15000);

test("deleting a plan confirms first and goes back to the list", async () => {
  const user = userEvent.setup();
  renderDetail();
  await user.click(
    await screen.findByRole("button", { name: "Delete Team" }, LOAD_TIMEOUT),
  );
  expect(
    await screen.findByText(/Its 2 users move to the default plan/),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Delete plan" }));

  await vi.waitFor(() =>
    expect(push).toHaveBeenCalledWith("/back-office/plans"),
  );
  expect(vi.mocked(deletePlan)).toHaveBeenCalledWith("team");
}, 15000);

test("the default plan can't be deleted", async () => {
  plan = { ...plan, id: "free", isDefault: true, name: "Free" };
  renderDetail();
  expect(
    await screen.findByRole("button", { name: "Delete Free" }, LOAD_TIMEOUT),
  ).toBeDisabled();
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
