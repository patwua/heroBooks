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
