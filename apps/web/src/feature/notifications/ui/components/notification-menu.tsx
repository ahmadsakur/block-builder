"use client";

import {
  BellOffIcon,
  CircleCheckIcon,
  CloudAlertIcon,
  MessageSquareIcon,
  TriangleAlertIcon,
  UserPlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import EmptyState from "@/components/_common/empty-state";
import { Button } from "@/components/_ui/button";
import type { ActivityTone } from "@/components/dashboardblocks/activity-feed";
import {
  BlockReady,
  BlockStateProvider,
  BlockStateRows,
  type BlockStatus,
  getBlockState,
} from "@/components/dashboardblocks/block-state";
import {
  type AppNotification,
  NotificationBell,
  NotificationItem,
  NotificationList,
  NotificationsHeader,
} from "@/components/dashboardblocks/notifications";
import type {
  NotificationKind,
  UserNotification,
} from "../../types/notifications.types";

const KIND_STYLE: Record<
  NotificationKind,
  { icon: ReactNode; tone: ActivityTone }
> = {
  alert: { icon: <TriangleAlertIcon />, tone: "warning" },
  member: { icon: <UserPlusIcon />, tone: "neutral" },
  mention: { icon: <MessageSquareIcon />, tone: "info" },
  success: { icon: <CircleCheckIcon />, tone: "success" },
};

function toAppNotification(notification: UserNotification): AppNotification {
  const { actor, at, body, id, kind, read, title } = notification;
  return {
    at: new Date(at),
    body,
    icon: KIND_STYLE[kind].icon,
    id,
    read,
    title: actor ? (
      <>
        <span className="font-medium">{actor}</span> {title}
      </>
    ) : (
      title
    ),
    tone: KIND_STYLE[kind].tone,
  };
}

type NotificationMenuProps = {
  notifications: UserNotification[];
  now: Date;
  status?: BlockStatus;
  onOpen: (id: string) => void;
  onMarkAllRead: () => void;
  onRetry: () => void;
};

export default function NotificationMenu({
  notifications,
  now,
  status,
  onOpen,
  onMarkAllRead,
  onRetry,
}: NotificationMenuProps) {
  const state = getBlockState(status, notifications);
  const unread = state
    ? 0
    : notifications.filter((notification) => !notification.read).length;

  return (
    <BlockStateProvider state={state}>
      <NotificationBell unreadCount={unread}>
        <NotificationsHeader
          description={
            <BlockReady>
              {unread > 0 ? `${unread} unread.` : "You’re all caught up."}
            </BlockReady>
          }
          action={
            unread > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                Mark all as read
              </Button>
            )
          }
        />
        {state === "loading" && (
          <div className="border-t px-4">
            <BlockStateRows rows={4} />
          </div>
        )}
        {state === "empty" && (
          <EmptyState
            className="border-t p-8"
            icon={<BellOffIcon />}
            title="No notifications"
            description="Mentions, alerts and team updates will show up here."
          />
        )}
        {state === "error" && (
          <EmptyState
            className="border-t p-8"
            tone="error"
            icon={<CloudAlertIcon />}
            title="Notifications didn't load"
            action={
              <Button variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            }
          />
        )}
        {!state && (
          <NotificationList className="max-h-96 overflow-y-auto border-t">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={toAppNotification(notification)}
                now={now}
                onOpen={() => onOpen(notification.id)}
              />
            ))}
          </NotificationList>
        )}
      </NotificationBell>
    </BlockStateProvider>
  );
}
