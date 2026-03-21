# Aura Project - Context & Decisions

## Project Overview
Aura is a no-code AI customer support agent builder for businesses. It allows users to create, train, and deploy custom AI agents that answer customer questions on websites, WhatsApp, Facebook Messenger, Instagram, and more.

**Tech Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Express + Drizzle ORM (PostgreSQL)
- AI: Google Gemini
- Payments: Stripe
- Deploy: Railway (currently)

## Key Features
1. **Agent Builder** - Configure AI agent name, tone, personality, boundaries
2. **Knowledge Base** - Upload PDFs, DOCX, TXT to train agent
3. **Playground** - Test agent responses in real-time
4. **Deployment** - One-click deploy to web widget, WhatsApp, Messenger, Instagram
5. **Conversations** - View and manage customer conversations
6. **Analytics** - Track satisfaction, response times, revenue impact
7. **Live Support Agent** - AI assistant in Help page for support questions

## Recent Changes (2025-03-21)
- **Playground**: Connected to real AI backend (was using random static replies)
- **Language Support**: Added full translation for chat responses (EN/LT/ES)
- **Support Agent**: Created dedicated `support-agent` with Help page chat widget
- **UI Polish**: Added dark/light theme toggle in sidebar
- **Color Scheme**: Updated to modern emerald green/white palette
- **Bug Fix**: Chat now responds in user's selected language (prefecture setting)

## Architecture Notes
- Agents stored in `agents` table with personality config
- Conversations linked to agents, stored in `conversations` table
- Messages stored with sentiment analysis
- Documents processed and content stored for AI context
- `/api/chat` endpoint handles all agent communication
- `storage.ts` MemStorage layer (in-memory, swap to Postgres for prod)

## Environment Variables Required
```bash
GOOGLE_API_KEY=        # Gemini API key
DATABASE_URL=          # PostgreSQL connection
STRIPE_SECRET_KEY=     # Stripe payments
STRIPE_WEBHOOK_SECRET= # Stripe webhook verification
SESSION_SECRET=        # Express session encryption
```

## Open Tasks
- [ ] Connect to real PostgreSQL (currently using in-memory storage)
- [ ] Add user authentication (session-based)
- [ ] Implement Stripe webhooks for subscription management
- [ ] Add email notifications (resend emails on escalations)
- [ ] Integrate actual WhatsApp/Messenger APIs (currently only widget)
- [ ] Multi-business account support
- [ ] Team member invitations
- [ ] Advanced analytics dashboards
- [ ] Mobile app (planned)

## Design Decisions
- **Color Palette**: Primary emerald green (HSL 160 84% 45%), clean white backgrounds
- **Typography**: Inter (UI), Literata (headings), JetBrains Mono (code)
- **Component Library**: Radix UI + custom styled components
- **Icons**: Lucide React + custom geometric shapes
- **Theme**: Dark mode default, toggleable to light mode

## User Preferences (Darius)
- Likes: Modern, minimalist, satisfying interactions
- Dislikes: AI-generated generic designs, bugs, slowness
- Goals: Professional polish, bug-free, automated video marketing system
- Languages: Primary EN, needs LT support for Lithuanian users

## Deployment
- **Current**: Railway (git push triggers auto-deploy)
- **Branch**: main
- **Repo**: github.com/monetmakers/aura-ai-platform

---

*Last updated: 2025-03-21*
