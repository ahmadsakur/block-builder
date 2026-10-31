import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { listPlans } from "@/feature/back-office/_shared/service/plans.service";
import { updatePlan } from "../service/plans.service";
import type { PlanSummary } from "../types/plans.types";
import PlansContainer from "./plans.container";

vi.mock("@/feature/back-office/_shared/service/plans.service", () => ({
  listPlans: vi.fn(),
}));

vi.mock("../service/plans.service", () => ({
  updatePlan: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

let plans: PlanSummary[];

beforeEach(() => {
  plans = [
    {
      description: "For trying things out.",
      id: "free",
      name: "Free",
      sort: 0,
      userCount: 1,
    },
    {
      description: "For people who ship.",
      id: "pro",
      name: "Pro",
      sort: 1,
      userCount: 4,
    },
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

test("lists plans with links to their users", async () => {
  renderPlans();
  expect(
    await screen.findByText("For people who ship.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "4 users" })).toHaveAttribute(
    "href",
    "/back-office/users?plan=pro",
  );
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
    await screen.findByText("Pro Plus", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
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
