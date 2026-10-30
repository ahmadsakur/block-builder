import DashboardShell from "@/components/_common/dashboard-shell";
import UserMenuContainer from "@/feature/auth/_shared/ui/user-menu.container";
import NotificationBellContainer from "@/feature/notifications/ui/notification-bell.container";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <DashboardShell
      area="user"
      headerActions={<NotificationBellContainer />}
      sidebarFooter={<UserMenuContainer />}
    >
      {children}
    </DashboardShell>
  );
}
