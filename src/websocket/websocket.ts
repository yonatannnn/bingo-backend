import { Server } from 'socket.io';
import Game from '../models/Game.model';
import { getGameEngine } from '../game/gameEngine';

export function setupWebSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Join game room
    socket.on('join-game', async (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      socket.join(`game-${gameId}`);
      console.log(`User ${userId} joined game ${gameId}`);

      // Send current game state
      const game = await Game.findById(gameId);
      if (game) {
        socket.emit('game-state', {
          gameId,
          status: game.status,
          drawnNumbers: game.drawnNumbers,
          players: game.players.length,
        });
      }
    });

    // Leave game room
    socket.on('leave-game', (data: { gameId: string }) => {
      const { gameId } = data;
      socket.leave(`game-${gameId}`);
      console.log(`Client left game ${gameId}`);
    });

    // Mark number on card
    socket.on('mark-number', async (data: {
      gameId: string;
      userId: string;
      cardId: number;
      number: number;
    }) => {
      try {
        const { gameId, userId, cardId, number } = data;
        const engine = getGameEngine(gameId);
        await engine.markNumber(userId, cardId, number);
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark number' });
      }
    });

    // Claim bingo
    socket.on('claim-bingo', async (data: {
      gameId: string;
      userId: string;
      cardId: number;
    }) => {
      try {
        const { gameId, userId, cardId } = data;
        const engine = getGameEngine(gameId);
        const result = await engine.checkPlayerWin(userId, cardId);

        if (result.hasWon) {
          socket.emit('bingo-valid', {
            message: result.message,
            pattern: result.pattern,
          });
        } else {
          socket.emit('bingo-invalid', {
            message: result.message || 'Invalid bingo',
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to check bingo' });
      }
    });

    // Start game (when countdown ends or player clicks start)
    socket.on('start-game', async (data: { gameId: string }) => {
      try {
        const { gameId } = data;
        const engine = getGameEngine(gameId);
        await engine.startGame();
      } catch (error) {
        socket.emit('error', { message: 'Failed to start game' });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  console.log('✅ WebSocket server initialized');
}

