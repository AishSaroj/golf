import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
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

// Connect to MongoDB
connectDB();

const app = express();

// Security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -----------------------------
// FIX: Rate limiter (IMPORTANT)
// -----------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit for dev (was 100)
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// ❌ OLD (REMOVED)
// app.use('/api', limiter);

// ✅ NEW (safe usage)
app.use('/api/auth', limiter);

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());

// Webhook needs raw body parser
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use('/uploads', express.static('uploads'));

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

// Global Error Handler
app.use(errorMiddleware);

export default app;