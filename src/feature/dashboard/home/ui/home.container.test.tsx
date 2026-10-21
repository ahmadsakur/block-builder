import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { expect, test } from "vitest";
import HomeContainer from "./home.container";

const LOAD_TIMEOUT = { timeout: 3000 };

function renderHome(searchParams = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <NuqsTestingAdapter searchParams={searchParams}>
      <QueryClientProvider client={client}>
        <HomeContainer />
      </QueryClientProvider>
    </NuqsTestingAdapter>,
  );
}

test("loads the overview through the service", async () => {
  renderHome();
  const products = await screen.findAllByText(
    "Ergonomic chair",
    {},
    LOAD_TIMEOUT,
  );
  expect(products.length).toBeGreaterThan(0);
});

test("reads filters from the URL", async () => {
  renderHome("?region=Europe");
  expect(await screen.findByText("Change region")).toBeInTheDocument();
});
