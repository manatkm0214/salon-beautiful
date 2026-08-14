This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Setup for local development (Prisma / Postgres / Auth)

This project includes a minimal booking API using Prisma + PostgreSQL and an Auth0-compatible authentication stub. To get started locally:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Postgres database and set the DATABASE_URL environment variable (example .env):

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/salon_db?schema=public"
   BANK_ACCOUNT_NAME="Your Salon Name"
   BANK_ACCOUNT_NUMBER="000-0000-000"
   BANK_NAME="Sample Bank"
   # Auth0 settings (fill if you integrate Auth0)
   AUTH0_ISSUER_BASE_URL="https://YOUR_DOMAIN"
   AUTH0_CLIENT_ID="YOUR_CLIENT_ID"
   AUTH0_CLIENT_SECRET="YOUR_CLIENT_SECRET"
   ```

3. Push Prisma schema to the database and generate the client:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

API endpoints (app router):

- POST /api/bookings — 予約作成。body に userEmail, userName, serviceId, scheduledAt, amountCents, note を送ると予約と payment (BANK_TRANSFER) が作られ、銀行振込情報を返します。
- GET /api/bookings — 予約一覧（将来的に認証が必要）。
- POST /api/bookings/[id]/confirm — 管理者が入金確認を行い、支払いを paid=true にして予約を CONFIRMED にします。

このブランチでは銀行振込は「手動確認」方式です。Auth0 や管理画面、UI の作り込みは次のステップで実装できます。
