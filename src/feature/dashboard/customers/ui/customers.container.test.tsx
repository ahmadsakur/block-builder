import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { expect, test } from "vitest";
import CustomersContainer from "./customers.container";

const LOAD_TIMEOUT = { timeout: 3000 };

function renderCustomers(searchParams = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <NuqsTestingAdapter searchParams={searchParams} hasMemory>
      <QueryClientProvider client={client}>
        <CustomersContainer />
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
}

test("loads a page of customers through the service", async () => {
  renderCustomers();
  expect(
    await screen.findByText("110 accounts match.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
});

test("selecting a row swaps the toolbar for the export bar", async () => {
  const user = userEvent.setup();
  renderCustomers();
  await screen.findByText("110 accounts match.", {}, LOAD_TIMEOUT);
  const [, firstRow] = screen.getAllByRole("checkbox");
  await user.click(firstRow);
  expect(
    await screen.findByRole("button", { name: "Export" }),
  ).toBeInTheDocument();
});

test("search from the URL narrows the list", async () => {
  renderCustomers("?q=northwind");
  expect(
    await screen.findByText("5 accounts match.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.getByText("Northwind EU")).toBeInTheDocument();
});

test("edit opens the sheet prefilled and saves", async () => {
  const user = userEvent.setup();
  renderCustomers("?q=northwind");
  await screen.findByText("5 accounts match.", {}, LOAD_TIMEOUT);

  await user.click(
    screen.getByRole("button", { name: "Actions for Northwind EU" }),
  );
  await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

  expect(
    await screen.findByRole("heading", { name: "Edit Northwind EU" }),
  ).toBeInTheDocument();
  const company = screen.getByLabelText("Company");
  expect(company).toHaveValue("Northwind EU");

  await user.clear(company);
  await user.type(company, "Northwind Europe");
  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(
    await screen.findByText("Northwind Europe", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
}, 15000);

test("delete asks for confirmation, then removes the row", async () => {
  const user = userEvent.setup();
  renderCustomers("?q=northwind");
  await screen.findByText("5 accounts match.", {}, LOAD_TIMEOUT);

  await user.click(
    screen.getByRole("button", { name: "Actions for Northwind APAC" }),
  );
  await user.click(await screen.findByRole("menuitem", { name: "Delete" }));

  expect(
    await screen.findByRole("alertdialog", { name: "Delete Northwind APAC?" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Delete customer" }));

  expect(
    await screen.findByText("4 accounts match.", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
});

test("a search with no matches offers to clear the filters", async () => {
  const user = userEvent.setup();
  renderCustomers("?q=zzzz-nothing");
  expect(
    await screen.findByText("No customers match", {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Clear filters" }));

  expect(
    await screen.findByText(/^1\d\d accounts match\.$/, {}, LOAD_TIMEOUT),
  ).toBeInTheDocument();
  expect(screen.queryByText("No customers match")).not.toBeInTheDocument();
});
