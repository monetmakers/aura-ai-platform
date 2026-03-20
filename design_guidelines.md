# CX Studio Design Guidelines

## Design Approach
**Modern SaaS Application** — Drawing inspiration from Linear's precision, Stripe's clarity, and Notion's approachability. This is a productivity tool requiring clean information hierarchy and intuitive workflows for non-technical users.

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN) - All UI text
- Monospace: JetBrains Mono - Code snippets, API keys, widget embed codes

**Type Scale:**
- Hero/Page Titles: text-4xl font-semibold (36px)
- Section Headings: text-2xl font-semibold (24px)
- Subsections: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Labels/Captions: text-sm (14px)
- Metadata: text-xs (12px)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 8, 12, 16** (e.g., p-4, gap-8, mb-12)

**Application Structure:**
- Fixed left sidebar: w-64, navigation and account switcher
- Main content area: flex-1 with max-w-7xl mx-auto px-8
- Top navigation bar: h-16, search and user profile
- Two-column layouts for configuration panels: 60/40 split

---

## Component Library

**Navigation:**
- Sidebar with icon + label items, nested sub-menus for multi-business accounts
- Breadcrumb navigation for deep pages
- Tabs for switching between related views (Documents, Conversations, Analytics)

**Core UI Elements:**
- Cards with subtle borders, rounded-lg, p-6 for content grouping
- Buttons: Primary (filled), Secondary (outlined), Ghost (text-only)
- Input fields with floating labels, focus rings
- Dropdown selects with search capability
- Toggle switches for binary settings

**Document Upload:**
- Large drag-and-drop zone (min-h-64) with dashed border
- File list with thumbnails, progress bars, delete actions
- Accepted file type badges (PDF, DOCX, TXT, URL)

**Agent Configuration:**
- Slider controls with value display for personality settings (formality, response length)
- Radio button groups for tone selection (Professional, Friendly, Casual)
- Multi-select chips for knowledge boundaries
- Preview panel showing how settings affect responses

**Chat Playground:**
- Split view: conversation on left (2/3), configuration quick-access on right (1/3)
- Message bubbles: user (right-aligned), AI (left-aligned)
- Typing indicators, timestamp metadata
- "Fix this response" button on AI messages for training
- Input area with send button and character count

**Dashboard/Analytics:**
- Stat cards in grid-cols-4: total conversations, resolution rate, avg response time, satisfaction score
- Line charts for conversation volume over time
- Tag cloud for auto-categorized topics
- Recent conversations table with status badges

**Deployment Widget Generator:**
- Code preview window with syntax highlighting
- Copy-to-clipboard button
- Live preview iframe showing widget appearance
- Customization controls: accent color picker, position selector, greeting message

**Data Tables:**
- Sortable columns with arrow indicators
- Row hover states
- Pagination controls
- Quick actions menu (3-dot icon)
- Empty states with helpful CTAs

**Modals/Overlays:**
- Confirmation dialogs for destructive actions
- Slide-over panels for quick edits (w-96 from right)
- Full-page modals for complex workflows (agent creation wizard)

---

## Icons
**Heroicons** (via CDN) - Outline style for navigation, solid for buttons and status indicators

---

## Images

**Hero Section (Landing/Marketing Pages):**
- Large hero image showing business owner using the platform on laptop
- Dashboard screenshot or agent conversation mockup as visual proof
- Placement: Right side of hero split (40%), text content left (60%)

**Feature Sections:**
- UI screenshots demonstrating key features (document upload interface, chat playground)
- Illustrated icons for abstract concepts (AI training, multi-channel deployment)

**No hero image needed** for authenticated dashboard views - focus on functional UI

---

## Responsive Behavior
- Sidebar collapses to icon-only on tablet (w-16)
- Sidebar becomes slide-out drawer on mobile
- Two-column layouts stack vertically on mobile
- Dashboard stat cards: grid-cols-4 on desktop, grid-cols-2 on tablet, grid-cols-1 on mobile
- Chat playground becomes full-width on mobile with swipeable config panel

---

## Animations
**Minimal and purposeful:**
- Page transitions: fade in content (150ms)
- Button feedback: scale down on click
- Loading states: skeleton screens for content, spinner for actions
- **No** scroll animations, parallax, or decorative motion

---

## Key Design Principles
1. **Clarity over cleverness** - Every interaction should be immediately obvious
2. **Progressive disclosure** - Show basics first, advanced settings on demand
3. **Immediate feedback** - Every action gets visual confirmation
4. **Consistent patterns** - Same action types look the same everywhere
5. **Mobile-friendly** - Touch targets min 44px, generous tap areas