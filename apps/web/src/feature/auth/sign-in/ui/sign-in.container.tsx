"use client";

import { useRouter } from "next/navigation";
import BrandLogo from "@/components/_common/brand-logo";
import { AuthLayout } from "@/components/dashboardblocks/auth";
import { homeFor } from "@/lib/auth/routes";
import { useSignIn } from "../../_shared/query/auth.query";
import AuthLink from "../../_shared/ui/auth-link";
import SignInForm from "./components/sign-in-form";

export default function SignInContainer() {
  const router = useRouter();
  const signIn = useSignIn();

  return (
    <AuthLayout
      brand={<BrandLogo />}
      title="Sign in"
      description="Welcome back. Sign in to your workspace."
      footer={
        <span>
          No account yet? <AuthLink href="/sign-up">Create one</AuthLink>
        </span>
      }
    >
      <SignInForm
        pending={signIn.isPending}
        error={signIn.error?.message}
        onSubmit={(values) =>
          signIn.mutate(values, {
            onSuccess: (session) => router.push(homeFor(session.user.role)),
          })
        }
      />
    </AuthLayout>
  );
}
