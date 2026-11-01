import type { Metadata } from "next";
import SignInContainer from "@/feature/auth/sign-in/ui/sign-in.container";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <SignInContainer />;
}
