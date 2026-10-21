"use client";

import { queryStatus } from "@/lib/query-status";
import { NOW } from "../data/notifications.data";
import { unreadIds } from "../logic/notifications.logic";
import {
  useMarkNotificationsRead,
  useNotificationsQuery,
} from "../query/notifications.query";
import NotificationMenu from "./components/notification-menu";

export default function NotificationBellContainer() {
  const notifications = useNotificationsQuery();
  const markRead = useMarkNotificationsRead();
  const list = notifications.data ?? [];

  return (
    <NotificationMenu
      notifications={list}
      now={NOW}
      status={queryStatus(notifications)}
      onOpen={(id) => markRead.mutate([id])}
      onMarkAllRead={() => markRead.mutate(unreadIds(list))}
    />
  );
}
