# AURA - Testing Checklist

**Before deploying to production, verify all items below.**

---

## 🌐 Theme Testing

### Light Mode
- [ ] Background is white
- [ ] Text is dark gray
- [ ] Cards are white with emerald borders
- [ ] Buttons are emerald green
- [ ] All colors are readable (high contrast)

### Dark Mode
- [ ] Background is dark slate (almost black)
- [ ] Text is off-white
- [ ] Cards are dark with emerald borders
- [ ] Buttons are brighter emerald
- [ ] All colors are readable (high contrast)

### Theme Toggle
- [ ] Sun icon visible in light mode
- [ ] Moon icon visible in dark mode
- [ ] Clicking icon switches theme instantly
- [ ] Theme persists on refresh (localStorage)
- [ ] Theme applies to ALL pages (not just dashboard)

---

## 💳 Stripe Testing

### Checkout Flow
- [ ] Login to app
- [ ] Navigate to sidebar → view plans
- [ ] Click "Upgrade to Growth" plan
- [ ] Stripe checkout page opens
- [ ] URL is `checkout.stripe.com`
- [ ] Plan name shows correctly ("Aura Growth Plan")
- [ ] Price shows correctly ($29/month)

### Test Payment (Non-production)
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Any future expiry date (e.g., 12/25)
- [ ] Any 3-digit CVC (e.g., 123)
- [ ] Any ZIP code (e.g., 12345)
- [ ] Complete checkout
- [ ] Success page shows

### Webhook Verification
- [ ] Check Railway logs for webhook receipt
- [ ] Check database for updated user subscription
- [ ] User plan should be "growth"
- [ ] User should have stripeSubscriptionId

### Failed Payment
- [ ] Use card: `4000 0000 0000 0002` (visa fail)
- [ ] Verify error is shown gracefully
- [ ] User is NOT upgraded
- [ ] Can retry checkout

---

## 🎨 Landing Page (v2)

### Hero Section
- [ ] Headline is visible and readable
- [ ] Hero image/gradient loads
- [ ] CTA buttons are visible
- [ ] "Get Started Free" button is clickable
- [ ] "See How It Works" button scrolls to features
- [ ] Trust metrics display correctly (500+, 1M+, 99.9%)

### Features Section
- [ ] 3 feature cards display properly
- [ ] Icons are visible
- [ ] Feature descriptions are clear
- [ ] Hover effects work (on desktop)

### Pricing Section
- [ ] 3 pricing tiers show correctly
- [ ] Prices display correctly
- [ ] "Popular" badge on Growth plan
- [ ] CTA buttons are clickable

### Email Signup
- [ ] Email input accepts text
- [ ] "Get Started" button is clickable
- [ ] Submitting redirects to /register
- [ ] Email is passed in query string

### Footer
- [ ] All footer links are present
- [ ] Links are clickable
- [ ] Copyright year is correct

### Responsive Design
- [ ] Works on mobile (375px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1200px+ width)
- [ ] No horizontal scroll on any size

### Dark/Light Mode
- [ ] Landing page respects theme toggle
- [ ] Colors are readable in both modes
- [ ] Gradients look good in both modes

---

## 🗣️ Translations

### Lithuanian (lt)
- [ ] Dashboard text is in Lithuanian
- [ ] Navigation is in Lithuanian
- [ ] Sidebar plan names are in Lithuanian
- [ ] Common actions are in Lithuanian

### Language Switcher
- [ ] Visible in sidebar or header
- [ ] Clicking switches language instantly
- [ ] Page content updates immediately
- [ ] Persists on refresh (localStorage)

### English (en)
- [ ] All original English text is intact
- [ ] No broken translations
- [ ] Professional tone throughout

---

## 🔐 Authentication

### Sign Up
- [ ] Email field works
- [ ] Password field works
- [ ] Sign up button is clickable
- [ ] Success message shows
- [ ] Redirects to /dashboard

### Login
- [ ] Email field works
- [ ] Password field works
- [ ] "Forgot Password" link visible
- [ ] Login button is clickable
- [ ] Success message shows
- [ ] Redirects to /dashboard

### Session Persistence
- [ ] User stays logged in on refresh
- [ ] User can logout
- [ ] Logout clears session
- [ ] Redirects to /login

---

## 📊 Dashboard

### Agent Creation
- [ ] User can create new agent
- [ ] Agent name field works
- [ ] Agent personality/tone settings work
- [ ] Agent saves successfully

### Document Upload
- [ ] Can upload PDF
- [ ] Can upload Word doc
- [ ] Can upload text
- [ ] File size limit works (>10MB rejected)
- [ ] Upload shows progress

### Agent Testing
- [ ] Test mode loads
- [ ] Can send message to agent
- [ ] Agent responds with relevant answer
- [ ] Conversation history shows

### Conversations View
- [ ] Conversation list loads
- [ ] Can view conversation details
- [ ] Message history displays correctly
- [ ] Can search conversations

---

## 📱 Mobile Experience

### iPhone/iPad
- [ ] App is usable at 375px width
- [ ] Touch targets are large enough (44px+)
- [ ] No horizontal scroll
- [ ] Dark mode works
- [ ] Theme toggle is accessible

### Android
- [ ] App is usable at 360px width
- [ ] Touch targets are large enough
- [ ] Forms are mobile-friendly
- [ ] Keyboard doesn't hide important content

---

## ⚡ Performance

### Page Load
- [ ] Landing page loads in <2 seconds
- [ ] Dashboard loads in <3 seconds
- [ ] No blank page flashes

### Interactions
- [ ] Button clicks respond immediately
- [ ] Form submissions are responsive
- [ ] Search is snappy (<500ms)

### Images/Assets
- [ ] All images load
- [ ] No broken image icons
- [ ] Images don't cause layout shift

---

## 🐛 Error Handling

### Network Errors
- [ ] Show error message if API is down
- [ ] User can retry action
- [ ] Don't leave user in broken state

### Validation Errors
- [ ] Email validation works
- [ ] Password validation works
- [ ] Form errors are clear
- [ ] User can correct and retry

### Edge Cases
- [ ] Empty conversations list shows message
- [ ] No agents shows "create agent" CTA
- [ ] Very long text doesn't break layout
- [ ] Unicode/emoji handles correctly

---

## 📋 Before Deployment Checklist

### Code Quality
- [ ] No console errors
- [ ] No console warnings (acceptable: React key warnings)
- [ ] No TypeScript errors (if compiled)
- [ ] No hardcoded API keys

### Security
- [ ] No sensitive data in localStorage (except theme, language)
- [ ] HTTPS enforced in production
- [ ] CORS is properly configured
- [ ] API keys in environment variables only

### Browser Compatibility
- [ ] Works in Chrome (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Works in Edge (latest)

### Accessibility (Basic)
- [ ] Can tab through form fields
- [ ] Buttons are keyboard accessible
- [ ] Color contrast is good (WCAG AA at minimum)
- [ ] Alt text on images (if any)

---

## 📈 Monitoring (Post-Deploy)

### Metrics to Watch
- [ ] Error rate < 0.1%
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Uptime > 99%

### User Behavior
- [ ] Track signup→verify→login funnel
- [ ] Track agent creation→deployment funnel
- [ ] Track Stripe checkout success rate
- [ ] Track plan upgrade rate

---

## ✅ Sign-Off

When ALL items are checked:

- [ ] QA Lead: Reviewed and approved
- [ ] Backend Lead: Stripe integration verified
- [ ] Frontend Lead: UI/UX verified
- [ ] DevOps: Deployment process verified

**Date Tested:** _______________  
**Tested By:** _______________  
**Approved For Deployment:** _______________  

---

**If any item fails, STOP and fix before deploying.**  
**Production must be production-quality. 🎯**
