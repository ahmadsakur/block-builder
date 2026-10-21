import DashboardShell from "@/components/_common/dashboard-shell";
import NotificationBellContainer from "@/feature/notifications/ui/notification-bell.container";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <DashboardShell headerActions={<NotificationBellContainer />}>
      {children}
    </DashboardShell>
  );
}
