import type { UserNotification } from "../types/notifications.types";

export function markRead(notifications: UserNotification[], ids: string[]) {
  const read = new Set(ids);
  return notifications.map((notification) =>
    read.has(notification.id) ? { ...notification, read: true } : notification,
  );
}

export function unreadIds(notifications: UserNotification[]) {
  return notifications
    .filter((notification) => !notification.read)
    .map((notification) => notification.id);
}
