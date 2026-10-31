import type { Metadata } from "next";
import PermissionsContainer from "@/feature/back-office/permissions/ui/permissions.container";

export const metadata: Metadata = { title: "Permissions" };

export default function PermissionsPage() {
  return <PermissionsContainer />;
}
