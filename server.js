import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/api/cadastro', async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: error.message,
    });
  }
});

app.get('/api/cadastro', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        criadoEm: 'desc',
      },
    });

    return res.status(200).json({
      ok: true,
      usuarios,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: error.message,
    });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota de API não encontrada.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor local de API rodando em http://localhost:${port}`);
});
