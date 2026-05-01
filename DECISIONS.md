# Architectural Decisions

## Next.js 14 App Router

**Decision**: Use Next.js 14 with App Router instead of Pages Router or alternative frameworks.

**Rationale**:
- App Router provides better separation of server and client code, enabling efficient server-side authentication checks
- Built-in middleware support for auth redirects (sign-in, onboarding) without external libraries
- Improved performance with Server Components for data-heavy pages (profiles, feeds)
- React 18 streaming and Suspense for partial page loads
- Unmatched deployment experience on Vercel (same organization)
- Large ecosystem and community for combat sports domain-specific packages

**Trade-offs**:
- App Router is still evolving; some third-party libraries may have compatibility issues (mitigated by using stable, well-maintained packages)
- Learning curve for developers unfamiliar with Server Components

---

## Supabase for Backend & Database

**Decision**: Use Supabase (managed PostgreSQL + Auth + Storage) instead of Firebase, MongoDB, or custom backend.

**Rationale**:
- PostgreSQL gives us powerful data modeling (enums for user roles, disciplines; arrays for disciplines/looking_for)
- Supabase Auth integrates seamlessly with Next.js middleware for protected routes
- Row Level Security (RLS) provides fine-grained access control without custom auth middleware
- Real-time subscriptions available for future feed updates (Phase 2)
- Storage bucket for profile photos with public/private access control
- Generous free tier (500MB database, 1GB storage, 50k monthly active users)
- Single vendor (less integration overhead vs. Auth0 + separate database)

**Trade-offs**:
- Vendor lock-in (migrating off Supabase requires migration planning)
- Cold starts on serverless functions (mitigated by using HTTP APIs, not functions for MVP)
- Regional latency if users are globally distributed (not a concern for Phase 1 US-focused MVP)

---

## shadcn/ui + Radix UI + Tailwind CSS

**Decision**: Use shadcn/ui component library on top of Radix UI with Tailwind CSS for styling.

**Rationale**:
- shadcn/ui provides pre-built, accessible components (Dialog, Dropdown, Toast, Avatar, Select) that follow WAI-ARIA standards
- Copy-paste installation means zero runtime dependency bloat; components are part of the codebase
- Radix UI primitives are heavily battle-tested and support keyboard navigation, screen reader labels, and focus management
- Tailwind CSS enables rapid iteration with utility-first CSS; custom tokens (brand colors, spacing) are defined centrally
- Excellent TypeScript support across all three libraries
- Lower bundle size compared to Material-UI or Bootstrap

**Trade-offs**:
- Steeper learning curve for developers unfamiliar with headless component libraries
- Requires custom styling for components not included in shadcn/ui (mitigated by Radix UI's low-level components)

---

## No In-App Messaging (Phase 1)

**Decision**: Contact information is public and users can reach out directly. Defer in-app DMs to Phase 2.

**Rationale**:
- Significantly reduces MVP scope and complexity (no persistent chat database, websockets, or notification system needed)
- Contacts expose phone, email, Instagram, Facebook, WhatsApp, Signal—users can reach out via their preferred channel
- Reduces spam/harassment risk with initial public contact model (can add reputation/blocking in Phase 2)
- Allows users to opt-in to in-app messaging later (one-way upgrade, not breaking change)
- Focus on matching algorithm quality rather than messaging infrastructure

**Trade-offs**:
- Users must rely on external platforms to message (friction point)
- Can't track conversation history within the platform
- Phase 2 will need message history + conversation threads (larger engineering lift)

---

## Contact Information is Public (Not Gated)

**Decision**: Preferred contact method and value are readable by all authenticated users.

**Rationale**:
- MVP goal is enabling connections; gating contact info creates friction
- User segments (fighters, trainers, etc.) are all business professionals seeking partnerships—not a consumer consumer product with safety concerns
- "Contact reveals" table tracks who viewed your info for transparency (users can see who's interested)
- Optional: Phase 2 can add premium contact reveal notifications or contact request workflows
- Simpler onboarding (users fill in contact once, no per-message reveal flow)

**Trade-offs**:
- Risk of spam/scrapers (mitigated by RLS—only authenticated users can view)
- No granular access control per user (e.g., only show email to managers, not trainers)
- Users must actively monitor who's viewing their profile

---

## Geographic Filtering via Text Matching (State/Region)

**Decision**: Filter users by state_region text column with simple SQL LIKE/ILIKE queries, not PostGIS spatial databases.

**Rationale**:
- MVP doesn't require precise geolocation; state/region granularity is sufficient for combat sports (regional promotions, gym networks)
- PostGIS adds complexity (new extension, geographic data types, index overhead)
- Simple LIKE queries are fast enough for 10k-100k users (Phase 1-2 scale)
- Easy to extend: can add city-level filtering later without migration
- Allows custom region handling (e.g., "Los Angeles Metro Area" as a single value)

**Trade-offs**:
- Can't do distance-based filtering (e.g., "find trainers within 50 miles")
- Manual region matching for cross-state searches (must query both 'California' and 'TX')
- Phase 2 can upgrade to PostGIS if needed for nationwide gym/provider matching

---

## AI Match Results Cached 24 Hours Per User

**Decision**: Cache Anthropic API responses in match_requests table (request_payload + response_payload) with implicit 24-hour TTL.

**Rationale**:
- Anthropic API calls are expensive (~$0.03 per 1M input tokens); caching reduces costs
- Matching algorithm is deterministic for a given user profile snapshot (no need to re-run within 24h)
- 24-hour cache window balances freshness (new matches appear daily) with cost savings
- Implicit TTL: don't delete; let the response_payload serve as cached result indefinitely (users see "last matched 2 days ago")
- Easy to implement: SELECT match_requests WHERE user_id = $1 AND created_at > NOW() - interval '24 hours'

**Trade-offs**:
- Manual cache invalidation needed if user profile changes (soft invalidation: just run matching again)
- No explicit cache expiration (database will grow slowly; cleanup can happen in Phase 2)
- Users see stale results if they expect real-time re-matching (Phase 2 can add "Re-match Now" button with rate limiting)

---

## RLS Over Application-Level Authorization

**Decision**: Use Supabase RLS policies instead of application-layer authorization checks.

**Rationale**:
- RLS is enforced at the database layer—no way to bypass via API calls or client-side exploits
- Automatic: every SELECT/INSERT/UPDATE/DELETE is checked; no risk of forgetting an auth check in application code
- Performance: database filters rows before returning to client (fewer bytes transferred)
- Works across all access patterns (API, direct SQL, future mobile clients)

**Trade-offs**:
- RLS policies are harder to debug (cryptic SQL errors if policies are misconfigured)
- Testing RLS policies requires setting different auth contexts (more test complexity)
- Performance: RLS adds per-row checks (negligible for 100k users; potential issue at 10M+)

---

## Enums Over String Columns (User Roles, Disciplines)

**Decision**: Use PostgreSQL ENUM types for user_role, discipline, weight_class, etc.

**Rationale**:
- ENUM enforces valid values at database level (no risk of 'boxer' vs 'boxing' spelling inconsistencies)
- ENUM storage is more efficient (2 bytes per value vs. 5-20 bytes for text)
- Type safety in TypeScript: export type UserRole = 'fighter' | 'trainer' | ... mirrors database ENUM
- UI layer can use ROLE_LABELS and DISCIPLINE_LABELS to display user-friendly names
- Easy to add new values: ALTER TYPE user_role ADD VALUE 'new_role';

**Trade-offs**:
- Adding new enum values requires migration (not instant)
- Enum order is immutable once set (minor annoyance for display ordering)

---

## Single Database per Environment

**Decision**: One Supabase project per environment (development, staging, production).

**Rationale**:
- Clear separation of data and secrets
- Easier to test migrations before production
- Simplified disaster recovery (production data isolated)
- Lower operational complexity

**Implementation**: Different Supabase projects with different URLs in `.env.local` (dev), `.env.staging` (staging), and `.env.production` (prod).

---

## Summary

This architecture prioritizes:
1. **Speed to market**: Next.js + Supabase is the fastest path to a working MVP
2. **Security**: RLS + middleware handle auth at multiple layers
3. **Scalability**: PostgreSQL + Tailwind CSS scale to 100k users without rearchitecting
4. **Developer experience**: TypeScript, shadcn/ui, and Supabase CLI reduce cognitive load
5. **Phase 2 readiness**: Database schema supports messaging, payments, and video in future iterations
