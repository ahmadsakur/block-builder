import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import FilterMenu from "./filter-menu";

const OPTIONS = [
  { count: 12, label: "Active", value: "active" },
  { count: 4, label: "Trial", value: "trial" },
];

test("shows the label and All when nothing is picked", () => {
  render(
    <FilterMenu
      label="Status"
      options={OPTIONS}
      value={[]}
      onChange={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("button", { name: "Status: All" }),
  ).toBeInTheDocument();
});

test("summarizes several picks", () => {
  render(
    <FilterMenu
      label="Status"
      options={OPTIONS}
      value={["trial", "active"]}
      onChange={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("button", { name: "Status: Active +1" }),
  ).toBeInTheDocument();
});

test("adds a pick from the menu", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <FilterMenu
      label="Status"
      options={OPTIONS}
      value={["active"]}
      onChange={onChange}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Status: Active" }));
  await user.click(
    await screen.findByRole("menuitemcheckbox", { name: /Trial/ }),
  );
  expect(onChange).toHaveBeenCalledWith(["active", "trial"]);
});
