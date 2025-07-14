# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Setup:**
- `pnpm install` - Install dependencies
- `./start-database.sh` - Start PostgreSQL database (requires Docker)
- `./start-redis.sh` - Start Redis server (requires Docker)

**Development:**
- `pnpm dev` - Start Next.js development server with Turbo
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm preview` - Build and start production server

**Code Quality:**
- `pnpm check` - Run linting and type checking
- `pnpm lint` - ESLint only
- `pnpm lint:fix` - Fix auto-fixable lint issues
- `pnpm typecheck` - TypeScript type checking only
- `pnpm format:write` - Format code with Prettier
- `pnpm format:check` - Check code formatting

**Database:**
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:studio` - Open Drizzle Studio for database management

## Architecture Overview

This is a Next.js 15 application for deep search functionality, built with the T3 stack pattern:

**Core Stack:**
- **Framework:** Next.js 15 with App Router and Turbo
- **Database:** PostgreSQL with Drizzle ORM
- **Caching:** Redis with ioredis
- **Authentication:** NextAuth.js v5 (beta) with Discord provider
- **Styling:** Tailwind CSS with custom scrollbar utilities
- **Icons:** Lucide React
- **Search:** Serper API for web search functionality

**Key Architecture Patterns:**

1. **Redis Caching Layer** (`src/server/redis/redis.ts`):
   - Generic `cacheWithRedis` wrapper function
   - 6-hour cache expiry for API calls
   - Used to cache Serper API responses

2. **Database Schema** (`src/server/db/schema.ts`):
   - NextAuth.js adapter tables (users, accounts, sessions, verification tokens)
   - Multi-project schema with `ai-app-template_` prefix
   - TypeScript types exported via `DB` namespace

3. **Search Integration** (`src/serper.ts`):
   - Serper API wrapper with TypeScript interfaces
   - Cached search results through Redis
   - Comprehensive type definitions for search responses

4. **Authentication** (`src/server/auth/`):
   - NextAuth.js v5 configuration with Drizzle adapter
   - Discord OAuth provider
   - Session management with database persistence

**Directory Structure:**
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/server/` - Server-side utilities (auth, database, Redis)
- `drizzle/` - Database migrations and metadata

## Code Conventions

Follow the established patterns from `.cursorrules`:
- Use dash-case for file names (e.g., `auth-button.tsx`)
- Prefer TypeScript over JavaScript
- Use `import type { }` syntax for type-only imports
- Use `lucide-react` for icons
- Use Tailwind `size-*` classes instead of `h-* w-*`
- Use `pnpm` as package manager
- Prefer non-optional properties where possible

## Environment Setup

Required environment variables:
- `SERPER_API_KEY` - For web search functionality
- `REDIS_URL` - Redis connection string
- `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` - For authentication
- Database connection variables for PostgreSQL

## Development Notes

- Uses PostgreSQL and Redis which must be running before starting development
- Chat functionality is currently a UI mockup (hardcoded messages)
- Authentication is configured but may need additional provider setup
- The app follows a chat interface pattern with sidebar navigation