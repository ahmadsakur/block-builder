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
    <NuqsTestingAdapter searchParams={searchParams}>
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
