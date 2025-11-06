# Deploy to Vercel (5 Minutes)

This app uses **Neon** (free PostgreSQL) for the database.

## Setup

### 1. Create Neon Database (1 minute)

1. Go to [neon.tech](https://neon.tech) and sign up (free, no credit card)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)

### 2. Set Vercel Environment Variables (1 minute)

In your Vercel project:
- Go to **Settings** → **Environment Variables**
- Add these 3 variables:

```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=kCjohh8H1YPGF34UiSH4uIRRPaFaW5fc
BETTER_AUTH_URL=https://your-app.vercel.app
```

### 3. Deploy (1 minute)

```bash
git push origin main
```

That's it! Vercel will build and deploy automatically.

### 4. Seed Database (Optional - 1 minute)

After first deployment, seed with demo data:

```bash
DATABASE_URL="your-neon-url" npm run seed
```

## Demo Accounts

After seeding, you can login with:

- **Owner**: owner@example.com / password123
- **Admin**: admin@example.com / password123
- **Member**: member@example.com / password123

## Local Development

For local dev, you can use SQLite (no database setup needed):

```bash
# .env file already configured
DATABASE_URL="file:./prisma/dev.db"

npm run db:push  # Create local database
npm run seed     # Add demo data
npm run dev      # Start dev server
```

## Architecture

- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Database**: Neon PostgreSQL (production) / SQLite (local)
- **Auth**: Better Auth with RBAC
- **ORM**: Prisma

## Troubleshooting

**Build fails**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Run `npm run build` locally to test

**Can't login after deploy**
- Run the seed command to create demo accounts
- Check that `BETTER_AUTH_URL` matches your actual Vercel URL

**Database errors**
- Verify your Neon connection string is correct
- Make sure schema is pushed: `DATABASE_URL="your-url" npx prisma db push`
