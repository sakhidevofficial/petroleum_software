# Creating the database on Supabase

Yes. Use the **PostgreSQL** schema file for Supabase.

## File to use

- **`schema-supabase.sql`** – PostgreSQL schema for Supabase  
- `schema.sql` – MySQL/MariaDB (not for Supabase)

## Steps

1. **Open your project** at [supabase.com](https://supabase.com) and go to the **SQL Editor**.

2. **New query**  
   Click **“New query”**.

3. **Paste and run**  
   - Open `database/schema-supabase.sql` in your project.  
   - Copy its full contents.  
   - Paste into the Supabase SQL Editor.  
   - Click **“Run”** (or press Cmd/Ctrl + Enter).

4. **Check tables**  
   In the left sidebar, open **Table Editor**. You should see all new tables (e.g. `users`, `customers`, `sales`, `products`, etc.).

## Notes

- Supabase uses **PostgreSQL**; this schema uses `SERIAL`, `TIMESTAMPTZ`, `JSONB`, and `CHECK` constraints instead of MySQL syntax.
- Your app’s `users` table is in the `public` schema. Supabase’s built-in auth uses `auth.users`; they are separate.
- **Row Level Security (RLS)** is commented out at the bottom. If you use Supabase Auth and want RLS, uncomment those lines and add policies per table.

## Connection from your backend

In your backend `.env` (or Supabase **Settings → Database**), set:

- **Connection string** (URI) from Supabase: **Settings → Database → Connection string** (e.g. “URI”).
- Or use **Host**, **Port**, **Database**, **User**, **Password** if your app expects separate vars.

Your current backend uses **MongoDB/Mongoose**. To use Supabase (PostgreSQL) instead, you’d need to switch the backend to a PostgreSQL client (e.g. `pg` or an ORM like Prisma/Sequelize) and replace Mongoose models with SQL or the ORM. This schema only creates the tables; the app code must be updated to use PostgreSQL.
