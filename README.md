# heroBooks

Next.js application for heroBooks accounting.

## Stack
- Next.js
- Prisma
- NextAuth
- Tailwind CSS
- PostgreSQL

## Local Setup
1. Copy example environment file:
   ```sh
   cp .env.example .env
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Apply database migrations:
   ```sh
   npx prisma migrate dev
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Environment Variables
- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_URL` – base URL for NextAuth callbacks
- `NEXTAUTH_SECRET` – session encryption secret
- `GOOGLE_CLIENT_ID` – optional, enables Google SSO
- `GOOGLE_CLIENT_SECRET` – optional, enables Google SSO

## Testing
- Lint the project:
  ```sh
  npm run lint
  ```
- (No test suite yet) Once tests are added, run:
  ```sh
  npm test
  ```

## Deployment
1. Create a new Web Service on Render and connect this repository.
2. Set environment variables from your `.env` file.
3. Build command: `npm install && npx prisma migrate deploy`
4. Start command: `npm run start`
5. For manual deployment:
   ```sh
   npm run build
   npm start
   ```

## Roadmap
- Organization creation
- VAT invoices
- Public API
