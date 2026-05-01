# Phase 2 Roadmap

After the MVP launch, these features will unlock new monetization opportunities and user engagement.

## Core Features

### In-App Direct Messaging
- Private message threads between users
- Notification bell for new messages
- Unread message counts
- Message history persistence
- Read receipts (optional)
- Typing indicators (optional)
- Block user functionality
- Report/flag messages for abuse

**Complexity**: High (requires websockets or polling, notification system)
**Estimated effort**: 3-4 weeks
**Revenue impact**: Higher engagement, foundation for premium tier

---

### Verification Badges
- Boxrec/Sherdog/MMADB linked badges (auto-verified)
- Manual review for trainers, managers, promoters
- Verification status filters in discovery
- Trust scoring algorithm based on verification + activity

**Complexity**: Medium
**Estimated effort**: 2-3 weeks
**Revenue impact**: Premium verification (e.g., $5/month to remove review delay)

---

### Payments & Subscriptions
- Stripe integration for credit card processing
- Subscription tiers:
  - Free: 3 matches/month, basic profile
  - Pro: Unlimited matches, verified badge priority, analytics ($9.99/month)
  - Team: Manager/promoter tools, bulk invites ($29.99/month)
- Usage-based billing for premium features
- Invoice history and receipts

**Complexity**: High (Stripe API, webhook handling, subscription logic)
**Estimated effort**: 3-4 weeks
**Revenue impact**: Direct MRR, ~20% conversion expected

---

### Event Listings
- Promoters create fight cards with date, location, weight class divisions
- Fighters browse and express interest
- Matchmakers propose bouts to promoters
- Event status (registration open, fight card final, event completed)
- Attendance/watch party tracking

**Complexity**: Medium
**Estimated effort**: 2-3 weeks
**Revenue impact**: Promoters pay to list premium events

---

### Video Uploads & Highlights
- Upload fight video/highlight reels to Supabase Storage
- Video thumbnail generation (first frame + duration display)
- Public/private visibility toggle
- Video search by fighter, event, discipline
- Embedding videos in profiles and posts
- View counts and analytics (Pro feature)

**Complexity**: Medium (video encoding, thumbnail generation)
**Estimated effort**: 2-3 weeks
**Revenue impact**: Premium video storage tier, highlight subscription

---

### Push Notifications
- Browser push notifications for new matches, messages, interactions
- Email digest notifications (daily/weekly roundups)
- In-app notification center with history
- User preference controls (mute, frequency, channels)
- Notification templates for different event types

**Complexity**: Medium (service workers, notification API, email sending)
**Estimated effort**: 2 weeks
**Revenue impact**: Higher engagement → longer LTV

---

### Email Digest Campaigns
- Weekly "Your Matches" digest with top 3-5 match recommendations
- "New Fighters in Your Area" notification
- Promoter weekly event calendar
- Monthly industry recap (trending disciplines, regions)
- One-click unsubscribe + preference management

**Complexity**: Low (use SendGrid or Mailgun, cron jobs)
**Estimated effort**: 1 week
**Revenue impact**: Engagement driver for churn reduction

---

### Admin Panel
- Dashboard: User signups, DAU, matches created, revenue
- User management: Suspend, delete, edit profiles
- Content moderation: Flag posts, comments; approve/reject
- Support tickets queue
- Analytics: Most active disciplines, regions, user roles
- Manual verification approval for badges

**Complexity**: Medium
**Estimated effort**: 2-3 weeks
**Revenue impact**: Risk mitigation, community safety

---

### Mobile App (React Native / Expo)
- Native iOS and Android apps (Expo for faster time-to-market)
- Shared TypeScript types and API layer with web
- Push notifications (native)
- Biometric auth (fingerprint/face ID)
- Camera integration for profile photo uploads
- Offline-first messaging queue

**Complexity**: Very High (new platform, native modules)
**Estimated effort**: 6-8 weeks
**Revenue impact**: 2-3x mobile DAU over web, new retention metrics

---

### Fight Card Builder
- Promoters design fight cards with bracket visualization
- Matchmaker suggests fights based on ratings/rankings
- Auto-matching algorithm (weight class, record similarity)
- Sponsorship block insertion
- PDF/printable export for media distribution
- Live scoring integration (Phase 3)

**Complexity**: High (complex UI, algorithm design)
**Estimated effort**: 4-5 weeks
**Revenue impact**: Premium "Pro Promoter" tier ($99/month)

---

### Gym & Venue Directory
- Search gyms by location, disciplines offered, affiliation
- Venue booking integration (calendar, contact form)
- Gym amenities checklist (boxing ring, cage, weights, etc.)
- Reviews and ratings from fighters/trainers
- Photos and virtual tours
- Membership cost listings

**Complexity**: Medium-High
**Estimated effort**: 3-4 weeks
**Revenue impact**: Sponsorships from gym equipment companies

---

### Analytics Dashboard (Pro Feature)
- Profile view history (who checked you out)
- Match quality score over time (track how many matches became partnerships)
- Engagement metrics: post impressions, likes, comments
- Search rank by discipline/region
- A/B testing for profile copy/photos
- Conversion funnel: profile views → contact reveal → message → partnership

**Complexity**: Medium
**Estimated effort**: 2-3 weeks
**Revenue impact**: Core Premium feature ($9.99/month)

---

## Supporting Infrastructure

### Email Sending Service
- Set up SendGrid or Mailgun for transactional emails (welcome, password reset)
- Email templates with brand CSS (company logo, colors)
- Bounce handling and list cleanup

---

### Search & Filtering Enhancement
- Full-text search on bios, specialties, disciplines
- Advanced filters: record range, experience level, location radius
- Saved searches / watchlist (Pro feature)
- Search analytics to inform matching algorithm

---

### Error Logging & Monitoring
- Sentry or LogRocket for client-side errors
- Server-side error tracking (Sentry backend)
- Alert webhooks to Slack for critical errors

---

### SEO & Landing Page
- Landing page at `/` for unauthenticated users
- SEO meta tags (fighter profiles are unique URLs)
- Open Graph tags for social sharing (profile cards on Twitter/LinkedIn)
- Sitemap.xml and robots.txt
- Blog for content marketing (matchmaking tips, training articles)

---

## Prioritization Matrix

| Feature | Impact | Effort | Quarter |
|---------|--------|--------|---------|
| Email Digest | High | Low | Q3 2026 |
| In-App Messaging | Very High | High | Q3-Q4 2026 |
| Verification Badges | High | Medium | Q3 2026 |
| Admin Panel | High | Medium | Q3 2026 |
| Event Listings | Medium | Medium | Q4 2026 |
| Video Uploads | Medium | Medium | Q4 2026 |
| Push Notifications | High | Medium | Q4 2026 |
| Payments & Subscriptions | Very High | High | Q4 2026 |
| Analytics Dashboard | High | Medium | Q1 2027 |
| Mobile App | Very High | Very High | Q1-Q2 2027 |
| Fight Card Builder | High | High | Q2 2027 |
| Gym Directory | Medium | High | Q2 2027 |

---

## Notes

- **Q3 2026**: Focus on community safety (verification, admin panel) and engagement (messaging, digests)
- **Q4 2026**: Monetize with payments and expand content (events, video)
- **Q1 2027**: Launch mobile, add analytics
- **Q2 2027**: Pro features (fight card builder, gym directory)
- All timelines assume one full-time developer + one part-time designer
- Community feedback should drive actual prioritization (may differ from this roadmap)
