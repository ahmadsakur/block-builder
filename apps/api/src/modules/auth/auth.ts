import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { DEFAULT_ROLE } from "@block-builder/shared/auth";
import { DEFAULT_PLAN } from "@block-builder/shared/plans";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { adminAc, userAc } from "better-auth/plugins/admin/access";
import { db } from "../../db/client";
import { env } from "../../env";
import { sendEmail } from "../../lib/mailer";
import { deleteAvatarFile } from "../avatars/avatars.service";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Open this link to set a new password:\n\n${url}\n\nIf you didn't ask for this, ignore this email.`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Open this link to verify your email:\n\n${url}`,
      });
    },
  },
  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: true,
        defaultValue: DEFAULT_PLAN,
        input: false,
      },
    },
    changeEmail: { enabled: true },
    deleteUser: {
      enabled: true,
      beforeDelete: (user) => deleteAvatarFile(user.image),
    },
  },
  plugins: [
    admin({
      defaultRole: DEFAULT_ROLE,
      adminRoles: ["root"],
      roles: { root: adminAc, user: userAc },
    }),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
