# heroBooks — Milestone 1

## Stack
Next.js (App Router) • TypeScript • Tailwind  
Auth: NextAuth (Google + Credentials) • Prisma • Postgres

## Local
1) `cp .env.example .env` and set DATABASE_URL, NEXTAUTH_SECRET
2) `pnpm install`
3) `pnpm prisma migrate dev --name init`
4) `pnpm dev`

## Render
- Create **Postgres**; copy internal connection string -> `DATABASE_URL`
- Create **Web Service** from GitHub
  - Build: `pnpm install && pnpm dlx prisma generate && pnpm build`
  - Start: `pnpm dlx prisma migrate deploy && pnpm start`
  - Add envs from `.env.example`
- Point **herobooks.net** DNS to the service; enable HTTPS

## Next
- Org creation flow + role assignments
- Customers/Invoices data models
- VAT tax codes + compliant invoice PDF
- Public API (`/v1/*`) for SaveAlot DMS

✅ What you get now

Working site at herobooks.net (after Render deploy)

Sign-up/sign-in (email/password + optional Google)

Protected /app/* with a clean, modern shell

Brand assets in place (logo + favicon)
