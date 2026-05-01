# Real Fight Matchmaker

A next-generation combat sports networking and AI-powered matchmaking platform. Connect fighters, trainers, managers, promoters, matchmakers, and service providers in one seamless ecosystem.

## Overview

Real Fight Matchmaker is a full-stack Next.js 14 application built for the combat sports industry. It enables:

- **User Profiles** across 6 roles: Fighter, Trainer/Coach, Manager, Promoter, Matchmaker, Service Provider
- **AI-Powered Matching** using Anthropic's Claude API to find the best connections
- **Social Feed** with posts, comments, and likes
- **Contact Reveal Tracking** to monitor who viewed your contact information
- **Profile Completeness & Onboarding** to ensure quality data
- **Role-Based Access Control** via Supabase Row Level Security

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **AI**: Anthropic Claude API
- **Styling**: Tailwind CSS with custom tokens
- **Validation**: Zod

## Environment Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

3. Fill in your environment variables:
   - **NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Get from your Supabase project settings
   - **SUPABASE_SERVICE_ROLE_KEY**: Get from your Supabase project settings (keep secret)
   - **ANTHROPIC_API_KEY**: Get from your Anthropic dashboard
   - **NEXT_PUBLIC_APP_URL**: Set to `http://localhost:3000` for local development

## Supabase Setup

### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project" and fill in project details
3. Wait for the project to initialize (2-3 minutes)
4. Go to Project Settings > API to get your credentials

### Run Migrations

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Run the migration:
```bash
supabase migration up
```

Or manually run the SQL in `supabase/migrations/001_schema.sql` via the Supabase SQL editor.

### Seed Test Data

1. Run the seed SQL via Supabase dashboard (SQL Editor) or CLI:
```bash
supabase seed restore
```

Or manually copy-paste the contents of `supabase/seed.sql` into the SQL editor.

**Note**: The seed includes 15 realistic users with profiles. You'll need to create corresponding auth.users entries manually or via your sign-up flow for these to fully function. For development, the auth user IDs should match the UUIDs in the seed file.

### Create Storage Bucket

1. In Supabase Dashboard, go to Storage
2. Click "New bucket" and name it `avatars`
3. Make it public (Allow public access)
4. Add policy:
   - Policy type: SELECT
   - Role: public
   - Specify conditions: (bucket_id = 'avatars')

This allows public read access to profile photos while maintaining security.

## Local Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will:
- Redirect unauthenticated users to `/auth/sign-in`
- Redirect users with incomplete profiles to `/onboarding`
- Show the home feed for authenticated users with complete profiles

## Project Structure

```
src/
  app/              # Next.js App Router pages & layouts
  lib/
    supabase/       # Supabase client, server, and middleware
    utils.ts        # Utility functions, labels, colors
  types/
    index.ts        # TypeScript type definitions
  components/       # Reusable React components (built by UI agent)
  
supabase/
  migrations/       # SQL schema migrations
  seed.sql          # Test data seed
  
.env.example        # Environment variable template
tailwind.config.ts  # Tailwind CSS configuration
tsconfig.json       # TypeScript configuration
next.config.ts      # Next.js configuration
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
4. Click Deploy

Vercel will automatically:
- Run `npm install`
- Build with `npm run build`
- Start the production server

### First Production Deployment Checklist

- [ ] Run migrations against production Supabase project
- [ ] Seed initial data (or run manual signup flow)
- [ ] Enable email verification in Supabase Auth settings
- [ ] Configure custom email templates (optional)
- [ ] Test authentication flow end-to-end
- [ ] Verify Anthropic API key has sufficient quota
- [ ] Set up error logging/monitoring (Sentry recommended)
- [ ] Test profile image upload to storage bucket
- [ ] Verify RLS policies are functioning correctly

## Seeding Test Data

After setting up your Supabase project, you have 15 realistic test users ready:

- **5 Fighters**: Mix of boxing, MMA, kickboxing; various records and locations
- **3 Trainers**: Gym owners and coaches across US
- **2 Managers**: Sports management agencies
- **2 Promoters**: Sanctioning body relationships
- **1 Matchmaker**: Professional matchmaker with title-level experience
- **2 Providers**: Cutman and nutritionist service providers

All test users have complete profiles, realistic bios, and social feed posts with engagement.

## API Keys & Security

- **NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_ANON_KEY** are safe to expose (prefixed with `NEXT_PUBLIC_`)
- **SUPABASE_SERVICE_ROLE_KEY** must stay secret (server-only)
- **ANTHROPIC_API_KEY** must stay secret (server-only)
- Never commit `.env.local` to version control
- Rotate keys periodically in production

## Troubleshooting

### "Unexpected end of JSON input" during build
Ensure all environment variables are set. The build process needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Auth redirects not working
Verify that:
1. Supabase URL and keys are correct
2. Supabase project is initialized with the schema migration
3. You're accessing the app via `localhost:3000` (not `127.0.0.1:3000`)

### Images not loading
Check that the Supabase storage bucket `avatars` exists and is public. Verify remote image domains in `next.config.ts`.

### Database errors on seed
Ensure all migrations ran successfully. Check Supabase SQL editor for any errors in the migration output.

## Phase 2 Roadmap

See `TODO.md` for a complete list of planned features for Phase 2, including:
- In-app direct messaging
- Verification badges
- Payments and subscriptions
- Event listings
- Video uploads
- Push notifications
- Admin dashboard
- Mobile app (React Native)

## License

Proprietary - Real Fight Matchmaker
