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

## Image Pipeline (marketing images)

Script: `hb_image_pipeline.py` (Pillow-based)

Common examples (PowerShell):

1) Landing images (fit inside 1024x640, batch)

   python .\hb_image_pipeline.py --src "C:\heroBooks\heroBooks\public\landing\*.webp" --dst "C:\heroBooks\heroBooks\public\landing" --preset landing --quality 85

   Notes: `--preset landing` sets size=1024x640 and mode=fit. Files are written as `<name>-1024x640.webp` in `--dst` unless `--inplace` is used.

2) Avatars / leadership (square 512x512, crop, in-place)

   python .\hb_image_pipeline.py --src "C:\heroBooks\heroBooks\public\leadership\*.webp" --dst "C:\heroBooks\heroBooks\public\leadership" --preset avatar --inplace --quality 85

   Notes: `--preset avatar` sets size=512x512 and mode=crop. `--inplace` keeps original filenames.

3) Add branding (optional logo)

   python .\hb_image_pipeline.py --src "C:\path\to\image.webp" --dst "C:\out\dir" --size 1024x640 --mode crop --logo "C:\heroBooks\heroBooks\public\logos\heroBooks mini Color.png" --logo-placement bottom-left --logo-scale 15 --logo-opacity 100 --quality 85

Flags:
- `--src`: file(s) or glob(s)
- `--dst`: output file or directory
- `--size` WIDTHxHEIGHT (or use `--preset`)
- `--mode`: `crop` (cover + center-crop) or `fit` (contain + transparent padding)
- `--inplace`: keep original filenames (writes into `--dst` directory if provided)
- `--logo`: optional overlay (PNG recommended)
- `--logo-placement`: bottom-right | bottom-left | top-right | top-left | center
- `--logo-scale`: percent of output width (default 15)
- `--logo-opacity`: 0–100 (default 100)
- `--quality`: output quality for WebP/JPEG (default 85)
