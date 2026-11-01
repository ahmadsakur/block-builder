import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { demoEntitlements } from "@/feature/dashboard/_shared/data/plans.data";
import { getMyEntitlements } from "@/feature/dashboard/_shared/service/entitlements.service";
import { crmOverview } from "../data/crm.data";
import { getCrmOverview } from "../service/crm.service";
import HomeContainer from "./home.container";

vi.mock("../service/crm.service", () => ({ getCrmOverview: vi.fn() }));

vi.mock("@/feature/dashboard/_shared/service/entitlements.service", () => ({
  getMyEntitlements: vi.fn(),
  getPlans: vi.fn(),
}));

vi.mock("@/lib/auth/session-query", () => ({
  useSessionQuery: () => ({ data: { user: { name: "Ana Lima" } } }),
}));

const LOAD_TIMEOUT = { timeout: 3000 };
const NOW = new Date(2026, 10, 1, 9, 30);

beforeEach(() => {
  vi.mocked(getCrmOverview).mockResolvedValue(crmOverview(NOW));
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("free", 1));
});

function renderHome() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <HomeContainer />
    </QueryClientProvider>,
  );
}

test("greets the user and lays out the CRM overview", async () => {
  renderHome();

  expect(
    await screen.findByRole(
      "heading",
      { name: "You've closed 4 deals this week" },
      LOAD_TIMEOUT,
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Good morning, Ana")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "You've closed 4 deals this week" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Open pipeline")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Top performers" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Follow-ups" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: /plan$/ }, LOAD_TIMEOUT),
  ).toBeInTheDocument();
});

test("a failed load offers to try again", async () => {
  vi.mocked(getCrmOverview).mockRejectedValue(new Error("boom"));
  renderHome();

  expect(
    await screen.findByText("Your dashboard didn't load", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
});
