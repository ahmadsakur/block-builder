import { expect, test } from "vitest";
import { NOTIFICATIONS } from "../data/notifications.data";
import { markRead, unreadIds } from "./notifications.logic";

test("marking read leaves the other notifications alone", () => {
  const [first] = unreadIds(NOTIFICATIONS);
  const after = markRead(NOTIFICATIONS, [first]);
  expect(unreadIds(after)).toEqual(unreadIds(NOTIFICATIONS).slice(1));
});

test("marking every unread one clears the count", () => {
  expect(unreadIds(markRead(NOTIFICATIONS, unreadIds(NOTIFICATIONS)))).toEqual(
    [],
  );
});
