# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 Todo application built with TypeScript and Tailwind CSS v4. The application is a sample project used for illustrating and developing DeepGuide.ai functionality.

## Essential Commands

```bash
# Development
npm run dev        # Start development server on port 3001

# Build & Production
npm run build      # Create production build
npm start          # Run production server

# Code Quality
npm run lint       # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 14.2.3** with App Router
- **React 18** with TypeScript
- **Tailwind CSS v4** with PostCSS
- **TypeScript** with strict mode enabled
- **Prisma ORM** with PostgreSQL (Neon)
- **Better Auth** for authentication and RBAC

### Project Structure
- `/app` - Next.js App Router pages and layouts
  - `/todos` - Todo management with full CRUD
  - `/projects` - Project management
  - `/settings` - Organization settings with RBAC
  - `/profile` - User profile page
  - `/forms` - Form submissions
  - `/data-table` - Data table view
  - `/login`, `/signup` - Authentication pages
- `/components` - Reusable UI components (Navigation, etc.)
- `/lib` - Core utilities (Prisma client, auth config, permissions)
- `/prisma` - Database schema and migrations
- `/public` - Static assets

### Key Features
- **Authentication**: Better Auth with email/password
- **RBAC**: Organization-based access control (Owner, Admin, Member roles)
- **Todo Management**: Full CRUD with database persistence
- **Project Management**: Track projects with teams and progress
- **Team Members**: Manage team member information
- **Form Submissions**: Handle form data
- **Multi-tenancy**: Organization-based data isolation

### Configuration
- **TypeScript**: Path alias `@/*` maps to root directory
- **Next.js**: Standalone output mode with React strict mode
- **Environment Variables** in `.env`:
  - `DATABASE_URL` - PostgreSQL connection string (Neon)
  - `BETTER_AUTH_SECRET` - Authentication secret key
  - `BETTER_AUTH_URL` - Base URL of your application
  - `NEXT_PUBLIC_DEEPGUIDE_*` - DeepGuide integration (optional)

### Data Persistence
- **Database**: PostgreSQL (Neon for production, can use local PostgreSQL for dev)
- **ORM**: Prisma with models for:
  - Users, Sessions, Accounts (auth)
  - Organizations, Members, Invitations (RBAC)
  - Todos, Projects, TeamMembers, FormSubmissions (app data)
- **Auth**: Better Auth with organization plugin

### Database Commands
```bash
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
npm run seed           # Seed with demo data
```

### Demo Accounts (after seeding)
All accounts use password: `password123`
- `owner@example.com` - Full organization control
- `admin@example.com` - Comprehensive access
- `member@example.com` - Limited permissions