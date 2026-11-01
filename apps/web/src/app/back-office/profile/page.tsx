import type { Metadata } from "next";
import ProfileContainer from "@/feature/back-office/profile/ui/profile.container";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return <ProfileContainer />;
}
