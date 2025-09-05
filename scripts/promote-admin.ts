import { prisma } from "@/lib/prisma";

async function main() {
  const email = "patwuablog@gmail.com";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`No user found for ${email}. Sign in with Google once, then rerun.`);
    return;
  }
  if (user.role === "admin") {
    console.log("Already admin.");
    return;
  }
  await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } });
  console.log("Promoted to admin:", email);
}

main().finally(async () => {
  await prisma.$disconnect();
});
