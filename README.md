# heroBooks

heroBooks is a Next.js application using TypeScript, Tailwind CSS, Prisma and NextAuth.

## Environment Variables

Create an `.env` file based on `.env.example` and provide values for:

- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_URL` – base URL of the application
- `NEXTAUTH_SECRET` – secret used to sign NextAuth tokens
- `GOOGLE_CLIENT_ID` – Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` – Google OAuth client secret

## Local Development

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy the example environment file:
   ```sh
   cp .env.example .env
   ```
3. Apply database migrations and generate the Prisma client:
   ```sh
   npx prisma migrate dev
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment on Render

1. Create a new **Web Service** and a **PostgreSQL** database on Render.
2. Set the environment variables from the section above.
3. Use Build Command `npm install && npx prisma migrate deploy`.
4. Use Start Command `npm run start`.

## Roadmap

- Organization creation
- VAT invoices
- Public API
- More accounting integrations

