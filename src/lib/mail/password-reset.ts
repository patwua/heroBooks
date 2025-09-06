import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export async function issuePasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await sendMail({
    to: email,
    subject: "Reset your heroBooks password",
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes.</p>`,
  });
}

export async function redeemPasswordReset(token: string, newPasswordHash: string) {
  const rec = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!rec) throw new Error("Invalid or expired token");
  if (rec.usedAt) throw new Error("Token already used");
  if (rec.expiresAt < new Date()) throw new Error("Token expired");

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: rec.userId },
      data: { passwordHash: newPasswordHash },
    });
    await tx.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  });
}
