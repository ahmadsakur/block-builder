import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { expect, test, vi } from "vitest";
import {
  DEMO_PLANS,
  demoEntitlements,
} from "@/feature/dashboard/_shared/data/plans.data";
import UpgradeContainer from "./upgrade.container";

vi.mock("@/feature/dashboard/_shared/service/entitlements.service", () => ({
  getMyEntitlements: vi.fn(async () => demoEntitlements("free", 3)),
  getPlans: vi.fn(async () => DEMO_PLANS),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

function renderUpgrade(searchParams = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <NuqsTestingAdapter searchParams={searchParams}>
      <QueryClientProvider client={client}>
        <UpgradeContainer />
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
}

test("compares plans and marks the current one", async () => {
  renderUpgrade();
  const free = await screen.findByRole(
    "article",
    { name: "Free" },
    LOAD_TIMEOUT,
  );
  expect(within(free).getByText("Current plan")).toBeInTheDocument();
  expect(within(free).getAllByText("Not included")).toHaveLength(2);

  const pro = screen.getByRole("article", { name: "Pro" });
  expect(within(pro).getByText("25")).toBeInTheDocument();
  expect(within(pro).getAllByText("Included")).toHaveLength(2);
  expect(
    within(pro).getByText("Ask an admin to move you to Pro."),
  ).toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("says which feature sent the user here", async () => {
  renderUpgrade("?permission=analytics.view");
  expect(
    await screen.findByText("Analytics page is locked", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(
    screen.getByText("It's included in Pro. Ask an admin to move you to Pro."),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("article", { name: "Pro" })).getByText(
      "Recommended",
    ),
  ).toBeInTheDocument();
});

test("ignores an unknown permission in the URL", async () => {
  renderUpgrade("?permission=nope");
  await screen.findByRole("article", { name: "Free" }, LOAD_TIMEOUT);
  expect(screen.queryByText(/is locked/)).not.toBeInTheDocument();
});
