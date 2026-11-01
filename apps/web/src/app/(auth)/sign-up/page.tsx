import type { Metadata } from "next";
import SignUpContainer from "@/feature/auth/sign-up/ui/sign-up.container";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return <SignUpContainer />;
}
