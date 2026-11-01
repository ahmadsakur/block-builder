import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import ProjectForm from "./project-form";

function renderForm(props: Partial<Parameters<typeof ProjectForm>[0]> = {}) {
  const onSubmit = vi.fn();
  render(
    <ProjectForm
      pending={false}
      onSubmit={onSubmit}
      onCancel={vi.fn()}
      {...props}
    />,
  );
  return { onSubmit, user: userEvent.setup() };
}

test("requires a name before submitting", async () => {
  const { onSubmit, user } = renderForm();
  await user.click(screen.getByRole("button", { name: "Create project" }));

  expect(await screen.findByText("Enter a project name.")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("submits the trimmed name", async () => {
  const { onSubmit, user } = renderForm();
  await user.type(screen.getByLabelText("Project name"), "  Launch site  ");
  await user.click(screen.getByRole("button", { name: "Create project" }));

  expect(onSubmit).toHaveBeenCalledWith(
    { name: "Launch site" },
    expect.anything(),
  );
});

test("a plan error links to the upgrade page", () => {
  renderForm({
    error: "Your plan allows 3 projects.",
    upgrade: "projects.max",
  });
  expect(screen.getByText("Your plan allows 3 projects.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "See plans" })).toHaveAttribute(
    "href",
    "/dashboard/upgrade?permission=projects.max",
  );
});
