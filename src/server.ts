import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeBot } from './bot/bot';
import { setupWebSocket } from './websocket/websocket';
import gameRoutes from './routes/game.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Normalize origin URL (remove trailing slash)
const normalizeOrigin = (url: string): string => {
  return url.replace(/\/+$/, '');
};

// Get allowed origins
const getAllowedOrigins = (): string[] => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const normalized = normalizeOrigin(frontendUrl);
  // Allow both with and without trailing slash
  return [normalized, `${normalized}/`];
};

const allowedOrigins = getAllowedOrigins();

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(allowed => normalizeOrigin(origin) === normalizeOrigin(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware - CORS with origin normalization
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Normalize and check if origin is allowed
    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowed = allowedOrigins.some(allowed => normalizeOrigin(allowed) === normalizedOrigin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin} (normalized: ${normalizedOrigin})`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to normalize URLs (remove double slashes)
app.use((req, res, next) => {
  // Normalize the URL path by removing multiple consecutive slashes
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/+/g, '/');
  }
  next();
});

// Routes
app.use('/api/game', gameRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server immediately (no MongoDB connection needed)
const PORT = process.env.PORT || 3000;

// Setup WebSocket
setupWebSocket(io);

// NOTE: Game engine removed - game operations should be handled by external API

// Initialize Telegram Bot
initializeBot(io).catch((error) => {
  console.error('Failed to initialize bot:', error);
  process.exit(1);
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Telegram bot initialized`);
  console.log(`⚠️  Note: Using external API for all data operations`);
});

export { io };
