# Golf Charity Subscription Platform

A full-stack MERN platform for golf-based charity subscriptions, score tracking, automated draw results, winnings, notifications, referrals, audit logging, and admin reporting. The frontend uses React, Vite, Redux Toolkit, Framer Motion, Tailwind CSS, Recharts, React Hook Form, and Zod. The backend uses Node.js, Express, MongoDB, and Mongoose.

## Project Status

The major requirements in the project are implemented and the app has been validated locally.

Implemented highlights:
- JWT auth with refresh-token cookies
- Role-based access for Player and Admin accounts
- Score submission and draw history
- Winnings and notifications
- Referral flow and referral tracking
- Audit logging for important actions
- Onboarding walkthrough
- Live analytics charts in the dashboard
- React Hook Form and Zod validation on key forms
- Premium UI polish and animated layout

## Tech Stack

Frontend:
- React 18
- Vite
- React Router v6
- Redux Toolkit
- redux-persist
- Axios
- Framer Motion
- Tailwind CSS
- React Hook Form
- Zod
- Recharts
- react-hot-toast

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cors
- helmet
- morgan
- express-rate-limit
- express-validator
- multer
- nodemailer
- Stripe

## Repository Structure

- `client/` - React frontend
- `server/` - Express API and MongoDB models
- `README.md` - project guide and deployment steps

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string
- Stripe secret and price IDs if you want subscription flows enabled

## Local Setup

### 1. Install dependencies

Install the root package first, then install dependencies in each app:

```bash
npm install
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Create or update the environment files in both apps.

Backend variables typically include:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_MONTHLY_PRICE_ID=your_monthly_price_id
STRIPE_ANNUAL_PRICE_ID=your_annual_price_id
```

Frontend variables typically include:

```bash
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

The seed script creates demo charities, users, subscriptions, scores, draws, winners, notifications, and audit data.

```bash
cd server
npm run seed
```

### 4. Run the app locally

From the project root:

```bash
npm run dev
```

That starts:
- Backend on `http://localhost:5001`
- Frontend on `http://localhost:5173`

To run either app on its own:

```bash
cd server
npm run dev

cd ../client
npm run dev
```

## Test Credentials

These credentials are already seeded in the database:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | password123 |
| Player | john@example.com | password123 |
| Player | emma@example.com | password123 |

Notes:
- Admin login requires the Admin role to be selected on the login screen.
- Player accounts require the Player role to be selected.
- Use these accounts for reviewer testing.

## What To Check In The App

- Player dashboard and score submission
- Charity selection
- Draw results and winnings
- Notifications dropdown
- Referral code and referral history
- Onboarding walkthrough
- Admin stats, users, and audit trail
- Theme toggle persistence
- Responsive routing and animated page transitions
