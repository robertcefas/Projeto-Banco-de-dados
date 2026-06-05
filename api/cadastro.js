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

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { firebaseUid },
      });

      if (usuarioExistente) {
        const dadosAtualizacao = {};
        if (!usuarioExistente.telefone && telefone) {
          dadosAtualizacao.telefone = telefone;
        }
        if (usuarioExistente.nome !== nome) {
          dadosAtualizacao.nome = nome;
        }
        if (usuarioExistente.email !== email) {
          dadosAtualizacao.email = email;
        }

        if (Object.keys(dadosAtualizacao).length > 0) {
          const usuarioAtualizado = await prisma.usuario.update({
            where: { firebaseUid },
            data: dadosAtualizacao,
          });

          return res.status(200).json({
            ok: true,
            usuario: usuarioAtualizado,
          });
        }

        return res.status(200).json({
          ok: true,
          usuario: usuarioExistente,
        });
      }

      if (!telefone) {
        return res.status(400).json({
          erro: 'Telefone é obrigatório para criar um novo usuário.',
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
      const { firebaseUid } = req.query || {};

      if (firebaseUid) {
        const usuario = await prisma.usuario.findUnique({
          where: { firebaseUid },
        });

        return res.status(200).json({
          ok: true,
          usuario,
        });
      }

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
