import type { UserNotification } from "../types/notifications.types";

export const NOW = new Date(Date.UTC(2026, 9, 21, 12));

const minutesAgo = (minutes: number) =>
  new Date(NOW.getTime() - minutes * 60_000).toISOString();

export const NOTIFICATIONS: UserNotification[] = [
  {
    actor: "Priya Nair",
    at: minutesAgo(4),
    body: "“Can we ship the new pricing page before Friday?”",
    id: "n1",
    kind: "mention",
    read: false,
    title: "mentioned you in Pricing v3",
  },
  {
    at: minutesAgo(42),
    id: "n2",
    kind: "alert",
    read: false,
    title: "Checkout error rate passed 2% in eu-central-1",
  },
  {
    at: minutesAgo(180),
    id: "n3",
    kind: "success",
    read: false,
    title: "Your export of 2,481 customers is ready",
  },
  {
    actor: "Mateo Silva",
    at: minutesAgo(1_500),
    id: "n4",
    kind: "member",
    read: true,
    title: "joined your workspace",
  },
];
