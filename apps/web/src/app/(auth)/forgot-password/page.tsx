import type { Metadata } from "next";
import ForgotPasswordContainer from "@/feature/auth/forgot-password/ui/forgot-password.container";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordContainer />;
}
