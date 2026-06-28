import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorMiddleware from './middleware/error.middleware.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import scoreRoutes from './routes/score.routes.js';
import drawRoutes from './routes/draw.routes.js';
import charityRoutes from './routes/charity.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import winnerRoutes from './routes/winner.routes.js';
import adminRoutes from './routes/admin.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

dotenv.config();
connectDB();

const app = express();

// Security
app.use(helmet());

// Logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================
// RATE LIMITER (FIXED)
// ==========================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

// Apply globally to API (better than only auth)
app.use('/api', limiter);

// ==========================
// CORS (IMPORTANT FIX)
// ==========================
aapp.use(cors({
  origin: [
    "http://localhost:5173",
    "https://golf-olk7-git-main-aishsarojs-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Webhook raw body
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handler
app.use(errorMiddleware);

export default app;