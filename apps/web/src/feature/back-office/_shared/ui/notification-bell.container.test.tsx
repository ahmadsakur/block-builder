import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import NotificationBellContainer from "./notification-bell.container";

const LOAD_TIMEOUT = { timeout: 3000 };

test("mark all as read clears the unread count", async () => {
  const user = userEvent.setup();
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <NotificationBellContainer />
    </QueryClientProvider>,
  );

  const bell = await screen.findByRole(
    "button",
    { name: "Notifications, 3 unread" },
    LOAD_TIMEOUT,
  );
  await user.click(bell);
  await user.click(
    await screen.findByRole("button", { name: "Mark all as read" }),
  );

  expect(
    await screen.findByRole("button", { name: "Notifications" }),
  ).toBeInTheDocument();
});
