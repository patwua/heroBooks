# heroBooks

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
