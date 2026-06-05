import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@estudio.com";
  const nome = process.env.ADMIN_NOME ?? "Administrador";
  const firebaseUid = process.env.ADMIN_FIREBASE_UID ?? "seed-admin-uid";
  const rawPassword = process.env.ADMIN_PASSWORD ?? "123456";
  const senha = await bcrypt.hash(rawPassword, 10);

  await prisma.usuario.upsert({
    where: { email },
    update: { perfil: "admin", nome, firebaseUid, senha },
    create: {
      nome,
      email,
      firebaseUid,
      perfil: "admin",
      senha,
    },
  });

  console.log("Admin seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
