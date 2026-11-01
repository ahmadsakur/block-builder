import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { demoEntitlements } from "@/feature/dashboard/_shared/data/plans.data";
import { getMyEntitlements } from "@/feature/dashboard/_shared/service/entitlements.service";
import { ApiError } from "@/lib/api";
import {
  createProject,
  deleteProject,
  listProjects,
} from "../service/projects.service";
import type { Project } from "../types/projects.types";
import ProjectsContainer from "./projects.container";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/feature/dashboard/_shared/service/entitlements.service", () => ({
  getMyEntitlements: vi.fn(),
  getPlans: vi.fn(),
}));

vi.mock("../service/projects.service", () => ({
  createProject: vi.fn(),
  deleteProject: vi.fn(),
  exportProjects: vi.fn(),
  listProjects: vi.fn(),
}));

const LOAD_TIMEOUT = { timeout: 3000 };

const PROJECTS: Project[] = [
  { createdAt: "2026-10-30T12:00:00.000Z", id: "p-3", name: "Launch site" },
  { createdAt: "2026-10-20T12:00:00.000Z", id: "p-2", name: "Docs refresh" },
  { createdAt: "2026-10-10T12:00:00.000Z", id: "p-1", name: "Onboarding" },
];

beforeEach(() => {
  vi.mocked(getMyEntitlements).mockReset();
  vi.mocked(listProjects).mockReset();
  vi.mocked(createProject).mockReset();
  vi.mocked(deleteProject).mockReset();
});

function renderProjects() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ProjectsContainer />
    </QueryClientProvider>,
  );
}

test("a free plan at its limit locks New and Export behind upgrade links", async () => {
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("free", 3));
  vi.mocked(listProjects).mockResolvedValue(PROJECTS);
  renderProjects();

  expect(
    await screen.findByText(/3 of 3 projects/, {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New project" })).toBeDisabled();
  expect(
    screen.getByRole("link", { name: "Upgrade for more" }),
  ).toHaveAttribute("href", "/dashboard/upgrade?permission=projects.max");
  expect(
    screen.getByRole("button", { name: "Export CSV" }).closest("[inert]"),
  ).not.toBeNull();
  expect(screen.getByText("Pro")).toBeInTheDocument();
  expect(screen.getByText("Launch site")).toBeInTheDocument();
});

test("a pro plan can export and create a project", async () => {
  const user = userEvent.setup();
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("pro", 3));
  vi.mocked(listProjects).mockResolvedValue(PROJECTS);
  vi.mocked(createProject).mockResolvedValue({
    createdAt: "2026-10-31T12:00:00.000Z",
    id: "p-4",
    name: "Pricing page",
  });
  renderProjects();

  await screen.findByText(/3 of 25 projects/, {}, LOAD_TIMEOUT);
  expect(screen.getByRole("button", { name: "Export CSV" })).toBeEnabled();

  await user.click(screen.getByRole("button", { name: "New project" }));
  await user.type(await screen.findByLabelText("Project name"), "Pricing page");
  await user.click(screen.getByRole("button", { name: "Create project" }));

  await vi.waitFor(() =>
    expect(createProject).toHaveBeenCalledWith(
      { name: "Pricing page" },
      expect.anything(),
    ),
  );
  await vi.waitFor(() => expect(getMyEntitlements).toHaveBeenCalledTimes(2));
}, 15000);

test("a LIMIT_REACHED answer shows the API message with an upgrade action", async () => {
  const user = userEvent.setup();
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("free", 2));
  vi.mocked(listProjects).mockResolvedValue(PROJECTS.slice(0, 2));
  vi.mocked(createProject).mockRejectedValue(
    new ApiError(403, {
      code: "LIMIT_REACHED",
      message: "Your plan allows 3 projects.",
      permission: "projects.max",
    }),
  );
  renderProjects();

  await screen.findByText(/2 of 3 projects/, {}, LOAD_TIMEOUT);
  await user.click(screen.getByRole("button", { name: "New project" }));
  await user.type(await screen.findByLabelText("Project name"), "One more");
  await user.click(screen.getByRole("button", { name: "Create project" }));

  expect(
    await screen.findByText("Your plan allows 3 projects."),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "See plans" })).toHaveAttribute(
    "href",
    "/dashboard/upgrade?permission=projects.max",
  );
}, 15000);

test("no projects shows an empty state that can create one", async () => {
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("free", 0));
  vi.mocked(listProjects).mockResolvedValue([]);
  renderProjects();

  expect(
    await screen.findByText("No projects yet", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "New project" })).toHaveLength(
    2,
  );
});

test("delete asks for confirmation before removing the project", async () => {
  const user = userEvent.setup();
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("pro", 3));
  vi.mocked(listProjects).mockResolvedValue(PROJECTS);
  vi.mocked(deleteProject).mockResolvedValue(undefined);
  renderProjects();

  await user.click(
    await screen.findByRole(
      "button",
      { name: "Delete Docs refresh" },
      LOAD_TIMEOUT,
    ),
  );
  expect(
    await screen.findByRole("alertdialog", { name: "Delete Docs refresh?" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Delete project" }));

  await vi.waitFor(() =>
    expect(deleteProject).toHaveBeenCalledWith("p-2", expect.anything()),
  );
});

test("a failed list offers Try again", async () => {
  const user = userEvent.setup();
  vi.mocked(getMyEntitlements).mockResolvedValue(demoEntitlements("pro", 3));
  vi.mocked(listProjects)
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(PROJECTS);
  renderProjects();

  await user.click(
    await screen.findByRole("button", { name: "Try again" }, LOAD_TIMEOUT),
  );

  expect(await screen.findByText("Launch site")).toBeInTheDocument();
});
