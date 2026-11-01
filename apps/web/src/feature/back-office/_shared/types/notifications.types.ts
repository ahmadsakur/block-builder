export type NotificationKind = "mention" | "alert" | "success" | "member";

export interface UserNotification {
  id: string;
  kind: NotificationKind;
  actor?: string;
  title: string;
  body?: string;
  at: string;
  read: boolean;
}
