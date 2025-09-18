# WholeU Starter (Next.js + TypeScript + Tailwind v4 + Supabase)

## 1) Prereqs
- Node.js 20+
- npm or pnpm
- Supabase project (free)

## 2) Setup
```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3) Create database tables (run once in Supabase → SQL Editor)
Run the contents of `supabase_schema.sql`. Then seed a lesson:
```sql
insert into public.lessons (slug, title, content) values
('consent-101','Consent 101','<p>This is a sample lesson. Replace with real content.</p>');
```

## 4) Run locally
```bash
npm run dev
# open http://localhost:3000
```

## Notes
- Questions API uses a server Supabase client and relies on RLS policies for inserts.
- Tailwind v4 is configured via `@tailwindcss/postcss` and `@import "tailwindcss";` in `app/globals.css`.

## Auth + Profiles
- Uses `@supabase/auth-helpers-nextjs` for cookie-based auth.
- Login at `/login` (magic link). After login you land on `/dashboard`.
- A profile row is auto-created by the DB trigger. Update a user's role to `creator` or `admin` in the `profiles` table to unlock creator tools.

## Creator Lesson Editor
- Visit `/dashboard` (as `creator` or `admin`) → "Create new lesson" → `/creator/lessons/new`.
- The API writes to `public.lessons` and sets `created_by` to your user id.
- RLS allows only creators/admin to insert, and only the owner to update.

