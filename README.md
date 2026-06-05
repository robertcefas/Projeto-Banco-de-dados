# Projeto Banco de Dados

Este projeto é uma aplicação web criada com React e Vite para gerenciar cadastro de clientes e agendamentos de manicure.

## Visão geral

A aplicação possui:

- Frontend em React com roteamento via `react-router-dom`.
- Autenticação usando Firebase Authentication (login por e-mail/senha e Google).
- Backend local em Express para tratar chamadas à API em `/api/cadastro`.
- Banco de dados acessado via Prisma.
- Agenda de cliente com dados locais salvos no `localStorage`.
- Links rápidos para WhatsApp e Instagram na página de agenda.

## O que foi usado

- `vite` - bundler e servidor de desenvolvimento.
- `react` e `react-dom` - bibliotecas de interface.
- `react-router-dom` - roteamento de páginas.
- `firebase` - autenticação de usuário.
- `express` - servidor backend local para a API.
- `@prisma/client` e `prisma` - ORM para acesso ao banco de dados.
- `dotenv` - carregamento de variáveis de ambiente.
- `concurrently` - executa Vite e o servidor Express juntos.

## Como funciona

### Frontend

- `src/App.jsx` define as rotas:
  - `/` → `Login`
  - `/cadastro` → `Cadastro`
  - `/agenda-cliente` → `AgendaCliente`
  - `/painel-manicure` → `PainelManicure`

- `src/firebase.js` configura o Firebase e exporta `auth` e `provider`.
- `src/pages/login/Login.jsx` faz login com Firebase e consulta o backend para buscar ou criar o usuário.
- `src/pages/cadastro/Cadastro.jsx` envia dados de cadastro para `/api/cadastro`.
- `src/pages/agenda-cliente/AgendaCliente.jsx` exibe a agenda e inclui links para WhatsApp e Instagram.

### Backend

- `server.js` cria um servidor Express com rota `/api/cadastro`.
- O servidor aceita:
  - `GET /api/cadastro?firebaseUid=...` para buscar um usuário por UID do Firebase.
  - `GET /api/cadastro` para listar todos os usuários.
  - `POST /api/cadastro` para criar ou atualizar usuário.

- O `vite.config.js` está configurado para proxy `/api` para `http://localhost:4000`.

### Banco de dados

- O Prisma usa `prisma/schema.prisma` e o client é gerado em `node_modules/@prisma/client`.
- Use `.env` para configurar a conexão com o banco de dados.

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Gere o client Prisma (sempre que mudar o schema):

```bash
npx prisma generate
```

3. Inicie o projeto junto com o servidor de API:

```bash
npm run dev
```

Se preferir iniciar manualmente:

```bash
npm run dev:server
npm run dev
```

## O que pode ser alterado

### Links de WhatsApp e Instagram

Os links estão em:

- `src/pages/agenda-cliente/AgendaCliente.jsx`

Procure por:

```js
const whatsappLink = "https://wa.me/5571996740584";
const instagramLink = "https://www.instagram.com/evelinnaiils__?igsh=...";
```

Altere para os seus URLs ou números de contato.

### Configuração do Firebase

- Edite `src/firebase.js` com suas chaves do Firebase se quiser usar outro projeto.

### Banco de dados e Prisma

- Atualize `prisma/schema.prisma` para mudar o modelo de dados.
- Gere novamente com `npx prisma generate`.
- Configure a conexão no `.env`.

### Páginas e rotas

- `src/pages/login/Login.jsx` - fluxo de login e busca de usuário.
- `src/pages/cadastro/Cadastro.jsx` - formulário de cadastro.
- `src/pages/agenda-cliente/AgendaCliente.jsx` - agenda do cliente, horários e agendamentos.
- `src/pages/painel-manicure/PainelManicure.jsx` - painel administrativo.

### Serviços da agenda

Em `src/App.jsx` há código que carrega serviços iniciais para a agenda no `localStorage`:

- `Pé e Mão`
- `Mão`
- `Pé`
- `Alongamento em Gel`
- `Manutenção em Gel`
- `Remoção de Alongamento`
- `Esmaltação em Gel`
- `Banho de Gel`

Você pode modificar esses valores diretamente no array `listaInicial`.

## Observações

- O proxy de API do Vite redireciona chamadas `/api/...` para o servidor local de backend.
- Para atualizar o schema do Prisma, use `npx prisma generate` sempre que fizer mudanças em `prisma/schema.prisma`.
- Se quiser adicionar outras redes sociais, crie novas variáveis de link na página de agenda ou adicione componentes similares.
