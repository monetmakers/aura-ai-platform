# Aura - AI Customer Service Platform

## Overview

Aura is a no-code SaaS platform that enables small business owners to create, train, and deploy custom AI customer service agents using their own business data. The application provides document upload capabilities, agent personality configuration, real-time testing, and one-click deployment to multiple channels (web widget, Facebook Messenger, WhatsApp).

The platform targets non-technical users and emphasizes simplicity, visual configuration, and intuitive workflows inspired by modern SaaS applications like Linear, Stripe, and Notion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**Design System:**
- Custom color palette with light/dark mode support via CSS variables
- Typography using Inter (UI) and JetBrains Mono (code/monospace)
- Consistent spacing primitives (2, 4, 8, 12, 16)
- Componentized UI following "New York" shadcn style variant
- Modern SaaS aesthetics with subtle shadows, rounded corners, and elevated states

**State Management Philosophy:**
- Server state managed via React Query with optimistic updates
- Local UI state via React hooks (useState, useReducer)
- No global state management library needed due to React Query's capabilities
- Query invalidation patterns for cache synchronization after mutations

**Key Frontend Features:**
- Marketing landing page at "/" with pricing and CTAs
- Drag-and-drop document upload with progress tracking
- Visual agent configuration panel (tone, formality, boundaries)
- Real-time chat playground for testing agent responses
- Conversation history viewer with filtering
- Widget code generator with live preview
- Analytics dashboard with charts (Recharts library)

### Backend Architecture

**Technology Stack:**
- Express.js as the HTTP server framework
- Node.js with TypeScript and ESM modules
- PostgreSQL database via Drizzle ORM
- Session-based architecture using express-session with pg-simple store

**API Design:**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Multer for multipart form data (file uploads)
- File processing pipeline supporting PDF, DOCX, and TXT formats
- OpenAI integration for LLM-powered responses

**Document Processing Pipeline:**
1. File upload via multipart/form-data
2. Text extraction based on file type (pdf-parse for PDF, mammoth for DOCX)
3. Content storage in database with processing status
4. Semantic search preparation (vector embeddings - to be implemented)

**Core API Endpoints:**
- `GET /api/stats` - Dashboard statistics
- `GET /api/documents` - List all documents
- `POST /api/documents` - Upload new document (triggers auto-intent discovery)
- `DELETE /api/documents/:id` - Remove document
- `GET /api/agents` - List AI agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent configuration
- `GET /api/conversations` - Conversation history
- `POST /api/messages` - Send message to agent
- `GET /api/widget-config/:agentId` - Widget deployment configuration
- `GET /api/pricing` - Dynamic pricing configuration from config/pricing.json
- `GET /api/intents` - List all discovered intents
- `PATCH /api/intents/:id/status` - Update intent status (pending/approved/rejected)
- `DELETE /api/intents/:id` - Delete an intent
- `POST /api/intents/discover/:documentId` - Manually trigger intent discovery
- `GET /api/revenue/insights` - Revenue insights with upsell opportunities

**Error Handling:**
- Centralized error responses with appropriate HTTP status codes
- Request logging middleware for debugging
- File size limits (10MB) enforced at upload

### Data Storage

**Database: PostgreSQL**
- Managed via Drizzle ORM with type-safe query builder
- Schema-first approach with TypeScript types generated from schema
- Migration system using drizzle-kit

**Core Tables:**

1. **users** - Authentication and user management
   - id (UUID, primary key)
   - username (unique)
   - password (hashed)

2. **documents** - Uploaded training materials
   - id (UUID, primary key)
   - name, type, size, content
   - status (processing/processed)
   - uploadedAt timestamp

3. **agents** - AI configuration profiles
   - id (UUID, primary key)
   - name, greeting, tone, formality, responseLength
   - confidenceThreshold, boundaries (array)
   - isActive flag for multi-agent support
   - createdAt, updatedAt timestamps

4. **conversations** - Customer interaction sessions
   - id (UUID, primary key)
   - agentId (foreign key)
   - visitorId, status, satisfaction rating
   - createdAt, updatedAt timestamps

5. **messages** - Individual conversation messages
   - id (UUID, primary key)
   - conversationId (foreign key)
   - role (user/assistant), content
   - timestamp, confidence score

6. **widgetConfigs** - Deployment settings
   - agentId (foreign key)
   - primaryColor, position, greeting, botName
   - Custom branding per deployment

**In-Memory Storage Fallback:**
- MemStorage class implements the same IStorage interface
- Useful for development/testing without database setup
- All operations use the IStorage abstraction for flexibility

### External Dependencies

**AI/ML Services:**
- **OpenAI API** - Primary LLM provider for generating agent responses
  - GPT-4 Turbo for high-quality conversations
  - Text embedding API (planned) for semantic search
  - API key stored in environment variable

**File Processing Libraries:**
- **pdf-parse** - Extract text from PDF documents
- **mammoth** - Extract text from DOCX files
- **multer** - Handle multipart file uploads

**Database & Session Management:**
- **PostgreSQL** - Primary data store (required via DATABASE_URL env var)
- **connect-pg-simple** - PostgreSQL session store for express-session
- **Drizzle ORM** - Type-safe database queries and migrations

**Frontend UI Libraries:**
- **Radix UI** - Headless accessible components (@radix-ui/react-*)
- **Recharts** - Chart library for analytics dashboard
- **react-day-picker** - Date selection components
- **cmdk** - Command palette/search interface
- **vaul** - Drawer component primitive

**Development Tools:**
- **Vite** - Fast development server with HMR
- **esbuild** - Production bundling for server code
- **tsx** - TypeScript execution for development
- **Replit plugins** - Development banner, error overlay, code mapping

**Validation & Type Safety:**
- **Zod** - Runtime schema validation
- **drizzle-zod** - Generate Zod schemas from Drizzle tables
- **@hookform/resolvers** - Form validation with React Hook Form

**Authentication (Implemented):**
- **bcrypt** - Password hashing (10 salt rounds)
- **express-session** - Server-side session management (30 day cookies)
- Auth routes in `server/auth.ts`: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me, PATCH /api/auth/plan
- `/login` page — sign in with email + password, redirects to /dashboard
- `/register` page — full business registration form, persists to DB via API
- `useUser` hook syncs with server session on mount, keeps localStorage in sync for sidebar
- Sign out calls server logout endpoint and navigates to /login
- Landing page: Sign In → /login, Start Free / all CTAs → /register

**Payment Processing (Planned):**
- **Stripe** - Payment and subscription management

**Communication Channels (Planned):**
- **nodemailer** - Email notifications
- **ws** - WebSocket support for real-time features
- Integration endpoints for Facebook Messenger and WhatsApp

**Deployment Architecture:**
- Single-server deployment model
- Static files served from Express in production
- Client built to `dist/public`, server bundled to `dist/index.cjs`
- Environment-based configuration (NODE_ENV, DATABASE_URL, OPENAI_API_KEY)