# RepostHub - Auto-Repost Platform Demo

This is a working frontend prototype for the **RepostHub** platform. It demonstrates the complete user journey and UI/UX for managing classified ads, scheduling auto-reposts, and viewing analytics.

## How to Run the Demo

1. Make sure you have Node.js installed.
2. Open a terminal in the `frontend` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL (usually `http://localhost:5173`) in your browser.

## Demo Accounts

You can log in with the following mock credentials to explore different views:

**Regular User:**
- Email: `ali@demo.com`
- Password: `demo1234`

**Admin User:**
- Email: `admin@demo.com`
- Password: `admin1234`

## Features Included in Demo

- **Dashboard:** Overview of active ads, connected accounts, success rate, and recent activity feed.
- **Accounts:** Mock interface for connecting third-party classified ad accounts (e.g., OLX, Zameen).
- **My Ads:** Table of all ads with toggles for enabling auto-repost and setting intervals (1h, 3h, 6h, 12h, 24h).
- **Repost Logs:** Detailed logs of successful and failed repost actions.
- **Subscription:** Interactive pricing plans and credit purchasing UI.
- **Admin Panel (Admin only):** Overview of platform stats, all users, their plans, and a complete platform-wide log.

## Future Architecture Advisory

As requested, here is the recommended approach for the backend implementation in Phase 2:

### Proxies & CAPTCHA Handling
Since classified ad sites often block frequent automated actions:
1. **DataImpulse Proxies:** Use residential rotating proxies from DataImpulse. Each connected account should be assigned a sticky session proxy to avoid triggering "suspicious login" alerts.
2. **Headless Browsers:** Use Puppeteer or Playwright with stealth plugins to simulate real user interactions.
3. **CAPTCHA Solving:** Integrate a service like **2Captcha** or **CapSolver**. When the scraper encounters a CAPTCHA, it should pause, send the CAPTCHA to the solver API, and submit the response before continuing.

### Database & Auth
- **PostgreSQL** via Prisma ORM for relational data (Users, Accounts, Ads, Logs).
- **Redis** combined with **BullMQ** to queue and schedule the background jobs (the auto-reposting tasks) to ensure they run reliably at the specified intervals.
- **JWT** with `httpOnly` cookies for secure authentication.

---
*Built as a high-fidelity prototype to validate the user experience before backend integration.*
