import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import {
  getPermissionMatrix,
  setPermission,
} from "../service/permissions.service";
import type { PermissionMatrix } from "../types/permissions.types";
import PermissionsContainer from "./permissions.container";

vi.mock("../service/permissions.service", () => ({
  getPermissionMatrix: vi.fn(),
  setPermission: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

let matrix: PermissionMatrix;

beforeEach(() => {
  matrix = {
    plans: [
      { description: "", id: "free", name: "Free", sort: 0 },
      { description: "", id: "pro", name: "Pro", sort: 1 },
    ],
    values: [
      { enabled: true, key: "projects.max", limit: 3, planId: "free" },
      { enabled: false, key: "projects.export", limit: null, planId: "free" },
      { enabled: false, key: "analytics.view", limit: null, planId: "free" },
      { enabled: true, key: "projects.max", limit: 25, planId: "pro" },
      { enabled: true, key: "projects.export", limit: null, planId: "pro" },
      { enabled: true, key: "analytics.view", limit: null, planId: "pro" },
    ],
  };
  vi.mocked(getPermissionMatrix).mockImplementation(async () => matrix);
  vi.mocked(setPermission).mockImplementation(async (cell) => {
    matrix = {
      ...matrix,
      values: matrix.values.map((row) =>
        row.planId === cell.planId && row.key === cell.key ? cell : row,
      ),
    };
    return cell;
  });
});

function renderPermissions() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PermissionsContainer />
    </QueryClientProvider>,
  );
}

test("shows each feature's permissions for every plan", async () => {
  renderPermissions();
  expect(
    await screen.findByRole(
      "checkbox",
      { name: "Free: Analytics page, allowed" },
      LOAD_TIMEOUT,
    ),
  ).not.toBeChecked();
  expect(
    screen.getByRole("checkbox", { name: "Pro: Analytics page, allowed" }),
  ).toBeChecked();
  expect(
    screen.getByRole("spinbutton", { name: "Free: Projects, limit" }),
  ).toHaveValue(3);
});

test("saves only the changed cells", async () => {
  const user = userEvent.setup();
  renderPermissions();
  await user.click(
    await screen.findByRole(
      "checkbox",
      { name: "Free: Analytics page, allowed" },
      LOAD_TIMEOUT,
    ),
  );
  const limit = screen.getByRole("spinbutton", {
    name: "Pro: Projects, limit",
  });
  await user.clear(limit);

  expect(screen.getByText("2 unsaved changes")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(vi.mocked(setPermission)).toHaveBeenCalledTimes(2);
  expect(vi.mocked(setPermission)).toHaveBeenCalledWith({
    enabled: true,
    key: "analytics.view",
    limit: null,
    planId: "free",
  });
  expect(vi.mocked(setPermission)).toHaveBeenCalledWith({
    enabled: true,
    key: "projects.max",
    limit: null,
    planId: "pro",
  });
  expect(
    await screen.findByRole(
      "checkbox",
      { name: "Free: Analytics page, allowed" },
      LOAD_TIMEOUT,
    ),
  ).toBeChecked();
}, 15000);

test("blocks a fractional limit", async () => {
  const user = userEvent.setup();
  renderPermissions();
  const limit = await screen.findByRole(
    "spinbutton",
    { name: "Free: Projects, limit" },
    LOAD_TIMEOUT,
  );
  await user.clear(limit);
  await user.type(limit, "2.5");
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(await screen.findByText("Use a whole number.")).toBeInTheDocument();
  expect(vi.mocked(setPermission)).not.toHaveBeenCalled();
});

test("discard puts the saved values back", async () => {
  const user = userEvent.setup();
  renderPermissions();
  const allowed = await screen.findByRole(
    "checkbox",
    { name: "Pro: Export projects, allowed" },
    LOAD_TIMEOUT,
  );
  await user.click(allowed);
  expect(allowed).not.toBeChecked();

  await user.click(screen.getByRole("button", { name: "Discard" }));

  expect(allowed).toBeChecked();
  expect(screen.queryByText(/unsaved change/)).not.toBeInTheDocument();
});
