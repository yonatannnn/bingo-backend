import { Server } from 'socket.io';

export function setupWebSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Join game room
    socket.on('join-game', async (data: { gameId: string; userId: string }) => {
      const { gameId, userId } = data;
      socket.join(`game-${gameId}`);
      console.log(`User ${userId} joined game ${gameId}`);

      // NOTE: Game state should be fetched from external API
      // For now, send a placeholder response
      socket.emit('game-state', {
        gameId,
        status: 'waiting',
        drawnNumbers: [],
        players: 0,
        message: 'Game state requires external API implementation',
      });
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
      socket.emit('error', { 
        message: 'Game operations require external API implementation. Please implement game endpoints in your external API.' 
      });
    });

    // Claim bingo
    socket.on('claim-bingo', async (data: {
      gameId: string;
      userId: string;
      cardId: number;
    }) => {
      socket.emit('error', { 
        message: 'Game operations require external API implementation. Please implement game endpoints in your external API.' 
      });
    });

    // Start game (when countdown ends or player clicks start)
    socket.on('start-game', async (data: { gameId: string }) => {
      socket.emit('error', { 
        message: 'Game operations require external API implementation. Please implement game endpoints in your external API.' 
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  console.log('✅ WebSocket server initialized (game operations require external API)');
}
