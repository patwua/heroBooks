# heroBooks — Milestone 1

## Stack
Next.js (App Router) • TypeScript • Tailwind  
Auth: NextAuth (Google + Credentials) • Prisma • Postgres

## Local
1) `cp .env.example .env` and set `DATABASE_URL` to your hosted Postgres connection string and `NEXTAUTH_SECRET`
2) `npm i`
3) `npx prisma migrate deploy`
4) `npm run dev`

## Render
- Create **Postgres**; copy internal connection string -> `DATABASE_URL`
- Create **Web Service** from GitHub
  - Build: `npm run build`
  - Start: `npm start`
  - Add envs from `.env.example`
- Point **herobooks.net** DNS to the service; enable HTTPS
- Run `npx prisma migrate deploy` during deploys to apply migrations using the remote `DATABASE_URL`

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

## Inbound email
- Create `InboundMailbox` entries mapping an email address to an org. Example: `bills@herobooks.net` -> some org ID.
- Cron or manual trigger: `POST /api/admin/email-ingest/run` with header `x-ingest-secret: <EMAIL_INGEST_SECRET>` connects via IMAP and processes unseen messages.
- Webhook: `POST /api/email/inbound` with the same `x-ingest-secret` and JSON payload `{from,to,subject,text,attachments:[{filename,contentType,contentBase64}]}`.
- Both paths parse PDF attachments, create draft bills, and log results in `EmailIngestLog`.
