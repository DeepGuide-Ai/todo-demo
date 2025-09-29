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

### Project Structure
- `/app` - Next.js App Router pages and layouts
  - `/todos` - Main Todo application page with full CRUD functionality
  - Other routes include: login, signup, settings, projects, forms, data-table, upload
- `/components` - Reusable components (e.g., Navigation)
- `/public` - Static assets

### Key Features
- **Todo Management**: Full CRUD operations with localStorage persistence
- **Todo Properties**: Title, description, priority levels (low/medium/high), due dates
- **Filtering & Search**: Filter by status (all/active/completed), search by title/description
- **Sorting**: By date, priority, or title

### Configuration
- **TypeScript**: Path alias `@/*` maps to root directory
- **Next.js**: Standalone output mode with React strict mode
- **Environment Variables**: DeepGuide integration variables in `.env`:
  - `NEXT_PUBLIC_DEEPGUIDE_API_KEY`
  - `NEXT_PUBLIC_DEEPGUIDE_WORKSPACE_ID`
  - `NEXT_PUBLIC_DEEPGUIDE_BASE_URL`

### Data Persistence
Todos are stored in browser localStorage with the key `todos`. Each todo has:
- id, title, description, completed status, priority, dueDate, createdAt timestamp