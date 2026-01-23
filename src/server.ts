import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { initializeBot } from './bot/bot';
import { setupWebSocket } from './websocket/websocket';
import gameRoutes from './routes/game.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trial-bingo')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Drop email index if it exists (from previous schema)
    try {
      const db = mongoose.connection.db;
      await db.collection('users').dropIndex('email_1').catch(() => {
        // Index doesn't exist, ignore
      });
      console.log('✅ Cleaned up email index');
    } catch (error) {
      // Ignore errors
    }
    
    // Initialize cards if needed
    const { initializeCards } = await import('./game/cardGenerator');
    await initializeCards();
    
    // Setup WebSocket first
    setupWebSocket(io);
    
    // Set IO instance for game engine
    const { setIOInstance } = await import('./game/gameEngine');
    setIOInstance(io);
    
    // Initialize Telegram Bot
    initializeBot(io);
    
    // Start server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export { io };

