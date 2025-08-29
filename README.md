# heroBooks


## Stack Overview
heroBooks uses Next.js, Prisma, and NextAuth with PostgreSQL.

## Local Development
1. Copy env file:
   ```sh
   cp .env.example .env
   ```
2. Install dependencies:
   ```sh
   npm i
   ```
3. Apply migrations:
   ```sh
   npx prisma migrate dev
   ```
4. Start development server:
   ```sh
   npm run dev
   ```

## Environment Variables
The following variables configure authentication:
- `NEXTAUTH_SECRET` – required for session encryption.
- `NEXTAUTH_URL` – base URL for NextAuth callbacks.
- `GOOGLE_CLIENT_ID` – optional, enables Google SSO.
- `GOOGLE_CLIENT_SECRET` – optional, enables Google SSO.

## Deployment on Render
1. Create a new **Web Service** in Render and connect this repository.
2. Set the environment variables from `.env`.
3. Use Build Command `npm install && npx prisma migrate deploy`.
4. Use Start Command `npm run start`.

## Next
- Organization creation
- VAT invoices
- Public API

Next.js application for heroBooks accounting.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set values for `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET`.
3. Initialize the database and generate Prisma client:
   ```bash
   npx prisma migrate dev
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## Deployment

Build the application and start in production mode:
```bash
npm run build
npm start
```

