import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin.js <email>');
  process.exit(1);
}

async function setAdminPerfil() {
  try {
    const usuario = await prisma.usuario.update({
      where: { email },
      data: {
        perfil: 'admin',
      },
    });

    console.log(`Perfil de admin configurado para ${usuario.email}`);
  } catch (erro) {
    console.error('Erro ao atualizar perfil:', erro.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminPerfil();
