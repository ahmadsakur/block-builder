import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { CUSTOMERS } from "../../../data/customers.data";
import CustomerForm from "./customer-form";

const customer = CUSTOMERS[0];

function renderForm(props: Partial<Parameters<typeof CustomerForm>[0]> = {}) {
  const onSubmit = vi.fn();
  render(
    <CustomerForm
      pending={false}
      onSubmit={onSubmit}
      onCancel={vi.fn()}
      {...props}
    />,
  );
  return { onSubmit, user: userEvent.setup() };
}

test("create mode starts empty and validates", async () => {
  const { onSubmit, user } = renderForm();
  expect(screen.getByLabelText("Company")).toHaveValue("");

  await user.click(screen.getByRole("button", { name: "Create customer" }));

  expect(
    await screen.findByText("Enter the company name."),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("edit mode prefills the customer and submits changes", async () => {
  const { onSubmit, user } = renderForm({ customer });
  const company = screen.getByLabelText("Company");
  expect(company).toHaveValue(customer.company);

  await user.clear(company);
  await user.type(company, "Renamed Co");
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(onSubmit).toHaveBeenCalledWith(
    {
      company: "Renamed Co",
      email: customer.email,
      plan: customer.plan,
      seats: customer.seats,
      status: customer.status,
    },
    expect.anything(),
  );
});

test("rejects a non-numeric seat count", async () => {
  const { onSubmit, user } = renderForm({ customer });
  await user.clear(screen.getByLabelText("Seats"));
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(
    await screen.findByText("Enter the number of seats."),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});
