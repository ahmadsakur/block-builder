import { delay } from "@/lib/delay";
import { NOTIFICATIONS } from "../data/notifications.data";
import { markRead } from "../logic/notifications.logic";
import type { UserNotification } from "../types/notifications.types";

const MOCK_LATENCY_MS = 400;

let notifications = NOTIFICATIONS;

export async function getNotifications(): Promise<UserNotification[]> {
  await delay(MOCK_LATENCY_MS);
  return notifications;
}

export async function markNotificationsRead(ids: string[]): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  notifications = markRead(notifications, ids);
}
