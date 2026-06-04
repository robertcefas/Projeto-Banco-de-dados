import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { firebaseUid, nome, email, telefone } = req.body;

      if (!firebaseUid || !nome || !email) {
        return res.status(400).json({
          erro: 'firebaseUid, nome e email são obrigatórios.',
        });
      }

      const usuario = await prisma.usuario.create({
        data: {
          firebaseUid,
          nome,
          email,
          telefone,
        },
      });

      return res.status(201).json({
        ok: true,
        usuario,
      });
    }

    if (req.method === 'GET') {
      const usuarios = await prisma.usuario.findMany({
        orderBy: {
          criadoEm: 'desc',
        },
      });

      return res.status(200).json({
        ok: true,
        usuarios,
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      erro: `Método ${req.method} não suportado.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: error.message,
    });
  }
}
