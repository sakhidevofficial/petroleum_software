# petroleum_software

Petrol pump / filling station management software – **Mudasar Filling Station**.

## Structure

- **mudasar_backend** – Node.js (Express) API, PostgreSQL (Supabase)
- **mudasar_client** – React frontend
- **database** – SQL schemas (MySQL-style and Supabase/PostgreSQL)

## Backend

```bash
cd mudasar_backend
npm install
# Set .env (DATABASE_URL, PORT, etc.)
node server.js
```

Runs by default on `http://localhost:5001`.

## Frontend

```bash
cd mudasar_client
npm install
npm start
```

Runs by default on `http://localhost:3000`.

## Database

Use `database/schema.sql` or `database/schema-supabase.sql` as per your database. See `database/README-SUPABASE.md` for Supabase setup.
