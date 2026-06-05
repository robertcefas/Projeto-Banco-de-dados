-- Schema SQL (PostgreSQL) matching prisma/schema.prisma

CREATE TABLE "Usuario" (
  id SERIAL PRIMARY KEY,
  "firebaseUid" TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  perfil TEXT NOT NULL DEFAULT 'cliente',
  "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE "Cliente" (
  id SERIAL PRIMARY KEY,
  "usuarioId" INTEGER UNIQUE NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
  telefone TEXT,
  endereco TEXT,
  "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE "Profissional" (
  id SERIAL PRIMARY KEY,
  "usuarioId" INTEGER UNIQUE NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
  especialidade TEXT,
  telefone TEXT,
  "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE "Servico" (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  preco DOUBLE PRECISION NOT NULL,
  "duracaoMin" INTEGER NOT NULL,
  "profissionalId" INTEGER REFERENCES "Profissional"(id) ON DELETE SET NULL
);

CREATE TABLE "Agendamento" (
  id SERIAL PRIMARY KEY,
  "clienteId" INTEGER NOT NULL REFERENCES "Cliente"(id) ON DELETE CASCADE,
  "servicoId" INTEGER NOT NULL REFERENCES "Servico"(id) ON DELETE CASCADE,
  "profissionalId" INTEGER REFERENCES "Profissional"(id) ON DELETE SET NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  horario TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado',
  "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
