import DashboardShell from "@/components/_common/shell/dashboard-shell";
import { BACK_OFFICE_NAV } from "@/feature/back-office/_shared/data/back-office-nav.data";
import NotificationBellContainer from "@/feature/back-office/_shared/ui/notification-bell.container";

export default function BackOfficeLayout({
  children,
}: LayoutProps<"/back-office">) {
  return (
    <DashboardShell
      nav={BACK_OFFICE_NAV}
      headerActions={<NotificationBellContainer />}
    >
      {children}
    </DashboardShell>
  );
}
