Database SQL files

This project uses PostgreSQL by default (see `prisma/schema.prisma`).

Files in this folder:

- `schema_postgres.sql` — CREATE TABLE statements for PostgreSQL matching Prisma models.
- `schema_mysql.sql` — A MySQL-compatible translation (if you prefer MySQL).

Notes:
- The application is currently configured to use PostgreSQL via the `DATABASE_URL` env var.
- If you want to run locally with Postgres, set `DATABASE_URL` in your `.env` and run migrations or apply the `schema_postgres.sql` file.

Importing examples:

PostgreSQL (psql):

```bash
psql <connection-string> -f database_sql/schema_postgres.sql
```

MySQL (mysql client):

```bash
mysql -u user -p database_name < database_sql/schema_mysql.sql
```

Prisma tips:
- To generate migration files from `schema.prisma`, use:

```bash
npx prisma migrate dev --name init
```

- To open Prisma Studio:

```bash
npx prisma studio
```

If you want, I can also:
- Add `migrations/` files using `prisma migrate` (requires running the command in your environment).
- Export a SQL dump from your connected database (requires DB access).
