import type { Metadata } from "next";
import ProfileContainer from "@/feature/auth/profile/ui/profile.container";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return <ProfileContainer />;
}
