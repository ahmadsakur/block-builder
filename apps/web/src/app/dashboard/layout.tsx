import DashboardShell from "@/components/_common/shell/dashboard-shell";
import { DASHBOARD_NAV } from "@/feature/dashboard/_shared/data/dashboard-nav.data";
import NotificationBellContainer from "@/feature/dashboard/_shared/ui/notification-bell.container";
import UpgradeCardContainer from "@/feature/dashboard/_shared/ui/upgrade-card.container";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <DashboardShell
      nav={DASHBOARD_NAV}
      headerActions={<NotificationBellContainer />}
      sidebarFooter={<UpgradeCardContainer />}
    >
      {children}
    </DashboardShell>
  );
}
