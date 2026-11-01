import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { demoEntitlements } from "@/feature/dashboard/_shared/data/plans.data";
import { getMyEntitlements } from "@/feature/dashboard/_shared/service/entitlements.service";
import { ApiError } from "@/lib/api";
import { getAnalytics } from "../service/analytics.service";
import AnalyticsContainer from "./analytics.container";

vi.mock("@/feature/dashboard/_shared/service/entitlements.service", () => ({
  getMyEntitlements: vi.fn(),
  getPlans: vi.fn(),
}));

vi.mock("../service/analytics.service", () => ({
  getAnalytics: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

beforeEach(() => {
  vi.mocked(getMyEntitlements).mockReset();
  vi.mocked(getAnalytics).mockReset();
});

function renderAnalytics() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AnalyticsContainer />
    </QueryClientProvider>,
  );
}

test("a pro plan sees traffic stats and the daily chart", async () => {
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("pro", 0));
  vi.mocked(getAnalytics).mockResolvedValue({
    conversionRate: 0.05,
    conversions: 25,
    series: [
      { conversions: 10, date: "2026-10-30", visitors: 200 },
      { conversions: 15, date: "2026-10-31", visitors: 300 },
    ],
    visitors: 500,
  });
  renderAnalytics();

  expect(
    await screen.findByText(
      "Busiest day: Oct 31, with 300 visitors.",
      {},
      LOAD_TIMEOUT,
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Conversion rate")).toBeInTheDocument();
  expect(screen.getByText("5%")).toBeInTheDocument();
});

test("a free plan is locked without calling the analytics API", async () => {
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("free", 0));
  renderAnalytics();

  expect(
    await screen.findByText("Analytics page is locked", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(getAnalytics).not.toHaveBeenCalled();
});

test("a plan downgraded mid-session shows the API's locked message", async () => {
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("pro", 0));
  vi.mocked(getAnalytics).mockRejectedValue(
    new ApiError(403, {
      code: "FEATURE_LOCKED",
      message: "Your plan doesn't include analytics.",
      permission: "analytics.view",
    }),
  );
  renderAnalytics();

  expect(
    await screen.findByText(
      "Your plan doesn't include analytics.",
      {},
      LOAD_TIMEOUT,
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "See plans" })).toHaveAttribute(
    "href",
    "/dashboard/upgrade?permission=analytics.view",
  );
});
