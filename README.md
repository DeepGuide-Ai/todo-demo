# A Sample TODO Application

This is a sample application, used for illustrating and developing DeepGuide.ai (https://deepguide.ai)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma migrate deploy
```

3. Seed the database with demo account:
```bash
npm run seed
```

This creates a demo user:
- Email: `demo@example.com`
- Password: `password123`

4. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3001
