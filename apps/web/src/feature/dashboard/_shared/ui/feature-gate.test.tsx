import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { demoEntitlements } from "../data/plans.data";
import { getMyEntitlements } from "../service/entitlements.service";
import FeatureGate from "./feature-gate";
import NavLockBadge from "./nav-lock-badge";

vi.mock("../service/entitlements.service", () => ({
  getMyEntitlements: vi.fn(),
  getPlans: vi.fn(),
}));

const entitlements = vi.mocked(getMyEntitlements);

beforeEach(() => {
  entitlements.mockReset();
});

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

function renderGate() {
  return renderWithClient(
    <FeatureGate permission="analytics.view" fallback={<p>Checking plan</p>}>
      <p>Secret report</p>
    </FeatureGate>,
  );
}

test("shows the fallback, then the page when the plan allows it", async () => {
  entitlements.mockResolvedValue(demoEntitlements("pro", 0));
  renderGate();
  expect(screen.getByText("Checking plan")).toBeInTheDocument();
  expect(await screen.findByText("Secret report")).toBeInTheDocument();
});

test("a plan without the permission gets a locked state with an upgrade link", async () => {
  entitlements.mockResolvedValue(demoEntitlements("free", 0));
  renderGate();
  expect(
    await screen.findByText("Analytics page is locked"),
  ).toBeInTheDocument();
  expect(screen.queryByText("Secret report")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "See plans" })).toHaveAttribute(
    "href",
    "/dashboard/upgrade?permission=analytics.view",
  );
});

test("a failed plan check offers Try again", async () => {
  const user = userEvent.setup();
  entitlements.mockRejectedValueOnce(new Error("offline"));
  entitlements.mockResolvedValueOnce(demoEntitlements("pro", 0));
  renderGate();

  await user.click(await screen.findByRole("button", { name: "Try again" }));

  expect(await screen.findByText("Secret report")).toBeInTheDocument();
});

test("the nav badge shows a lock only when the permission is locked", async () => {
  entitlements.mockResolvedValue(demoEntitlements("free", 0));
  const { unmount } = renderWithClient(
    <NavLockBadge permission="analytics.view" />,
  );
  expect(await screen.findByText("Not in your plan")).toBeInTheDocument();
  unmount();

  entitlements.mockResolvedValue(demoEntitlements("pro", 0));
  renderWithClient(<NavLockBadge permission="analytics.view" />);
  await vi.waitFor(() => expect(entitlements).toHaveBeenCalledTimes(2));
  expect(screen.queryByText("Not in your plan")).not.toBeInTheDocument();
});
