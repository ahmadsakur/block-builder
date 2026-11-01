import { createTransport } from "nodemailer";
import { env } from "../env";

const transport = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
    : undefined,
});

export type Email = { to: string; subject: string; text: string };

export function sendEmail(email: Email): void {
  transport.sendMail({ from: env.MAIL_FROM, ...email }).catch((error) => {
    console.error(`Email "${email.subject}" to ${email.to} failed`, error);
  });
}
