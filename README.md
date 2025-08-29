# heroBooks

A Next.js accounting app scaffolded with TypeScript, Tailwind CSS, NextAuth, and Prisma.

## Setup

### 1. Environment Variables
Create a `.env` file from the example and provide real values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_URL` – base URL for NextAuth callbacks
- `NEXTAUTH_SECRET` – used to sign NextAuth tokens
- `GOOGLE_CLIENT_ID` – Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret

### 2. Local Development

```bash
npm install
npx prisma migrate dev
npm run dev
```

The app is now available at <http://localhost:3000>.

### 3. Deployment on Render

1. Create a new Web Service and connect this repository.
2. Set the environment variables above in the Render dashboard.
3. Build command:
   ```bash
   npm install && npx prisma migrate deploy
   ```
4. Start command:
   ```bash
   npm run start
   ```

## Roadmap

- Organization creation
- VAT invoices
- Public API
- Dashboard widgets
- Mobile-friendly UI

## Public API (v1)

Rotate an API key via `POST /api/admin/rotate-api-key` and configure a webhook URL with `POST /api/admin/set-webhook`.
Authenticated requests include `Authorization: Bearer <apiKey>`.

Available endpoints:

- `GET /api/v1/tax-codes` – list tax codes
- `POST /api/v1/customers` – create a customer
- `POST /api/v1/invoices` – create an invoice
- `POST /api/v1/payments` – record a payment

### Webhooks

If a webhook URL is configured, the app sends JSON payloads:

```json
{ "event": "invoice.created", "data": { /* invoice */ } }
{ "event": "payment.created", "data": { /* payment */ } }
```

### Running the project

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Outbound Email + DKIM

Configure SMTP credentials to enable transactional emails. The mailer uses the following environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

For DKIM signing, also set:

- `DKIM_DOMAIN`
- `DKIM_SELECTOR`
- `DKIM_PRIVATE_KEY`

Publish a DNS TXT record at `<selector>._domainkey.<domain>` containing the public key that matches `DKIM_PRIVATE_KEY`.

Available endpoints:

- `POST /api/email/send-invoice` – send an invoice email with PDF attachment
- `POST /api/email/send-receipt` – send a receipt email with PDF attachment
