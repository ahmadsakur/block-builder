"use client";

import { useRouter } from "next/navigation";
import BrandLogo from "@/components/_common/brand-logo";
import { AuthLayout } from "@/components/dashboardblocks/auth";
import { useSignUp } from "../../_shared/query/auth.query";
import AuthLink from "../../_shared/ui/auth-link";
import SignUpForm from "./components/sign-up-form";

export default function SignUpContainer() {
  const router = useRouter();
  const signUp = useSignUp();

  return (
    <AuthLayout
      brand={<BrandLogo />}
      title="Create your account"
      description="It takes less than a minute."
      footer={
        <span>
          Already have an account? <AuthLink href="/sign-in">Sign in</AuthLink>
        </span>
      }
    >
      <SignUpForm
        pending={signUp.isPending}
        error={signUp.error?.message}
        onSubmit={(values) =>
          signUp.mutate(values, { onSuccess: () => router.push("/dashboard") })
        }
      />
    </AuthLayout>
  );
}
