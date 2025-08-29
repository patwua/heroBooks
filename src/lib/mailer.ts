import nodemailer, { SendMailOptions } from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  ...(process.env.DKIM_DOMAIN &&
  process.env.DKIM_SELECTOR &&
  process.env.DKIM_PRIVATE_KEY
    ? {
        dkim: {
          domainName: process.env.DKIM_DOMAIN,
          keySelector: process.env.DKIM_SELECTOR,
          privateKey: process.env.DKIM_PRIVATE_KEY
        }
      }
    : {})
});

export function sendMail(opts: SendMailOptions) {
  return transporter.sendMail({ from: process.env.EMAIL_FROM, ...opts });
}
