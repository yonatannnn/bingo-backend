import { Server } from 'socket.io';
import Game, { IGame, GameStatus } from '../models/Game.model';
import User from '../models/User.model';
import { checkWin } from './winDetector';

// Store io instance
let ioInstance: Server | null = null;

export function setIOInstance(io: Server) {
  ioInstance = io;
}

function getIO(): Server {
  if (!ioInstance) {
    throw new Error('IO instance not set');
  }
  return ioInstance;
}

export class GameEngine {
  private gameId: string;
  private intervalId?: NodeJS.Timeout;
  private countdownInterval?: NodeJS.Timeout;
  private countdown: number = 60;
  private isCountingDown: boolean = false;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  /**
   * Start countdown timer (60 seconds)
   */
  async startCountdown(): Promise<void> {
    const game = await Game.findById(this.gameId);
    if (!game || game.status !== GameStatus.WAITING) return;

    this.isCountingDown = true;
    this.countdown = 60;

    this.countdownInterval = setInterval(async () => {
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isCountingDown = false;
        await this.startGame();
        return;
      }

      // Emit countdown to all players
      getIO().to(`game-${this.gameId}`).emit('countdown', {
        seconds: this.countdown,
        gameId: this.gameId,
      });

      this.countdown--;
    }, 1000);
  }

  /**
   * Stop countdown if no players
   */
  async stopCountdown(): Promise<void> {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
    this.isCountingDown = false;
    this.countdown = 60;

    const game = await Game.findById(this.gameId);
    if (game && game.players.length === 0) {
      getIO().to(`game-${this.gameId}`).emit('countdown-stopped', {
        gameId: this.gameId,
      });
    }
  }

  /**
   * Start the game - draw numbers every 2 seconds
   */
  async startGame(): Promise<void> {
    const game = await Game.findById(this.gameId);
    if (!game) return;

    if (game.players.length === 0) {
      game.status = GameStatus.CANCELLED;
      await game.save();
      getIO().to(`game-${this.gameId}`).emit('game-cancelled', {
        gameId: this.gameId,
      });
      return;
    }

    game.status = GameStatus.PLAYING;
    game.startTime = new Date();
    await game.save();

    // Deduct balance from all players
    for (const player of game.players) {
      await User.findByIdAndUpdate(player.userId, {
        $inc: { balance: -game.gameType },
      });
    }

    getIO().to(`game-${this.gameId}`).emit('game-started', {
      gameId: this.gameId,
      startTime: game.startTime,
    });

    // Draw numbers every 2 seconds
    this.intervalId = setInterval(async () => {
      await this.drawNumber();
    }, 2000);
  }

  /**
   * Draw a random number (1-75)
   */
  private async drawNumber(): Promise<void> {
    const game = await Game.findById(this.gameId);
    if (!game || game.status !== GameStatus.PLAYING) {
      this.stopGame();
      return;
    }

    // Generate random number between 1-75
    let drawnNumber: number;
    do {
      drawnNumber = Math.floor(Math.random() * 75) + 1;
    } while (game.drawnNumbers.includes(drawnNumber));

    game.drawnNumbers.push(drawnNumber);
    await game.save();

    // Get column letter
    const column = this.getColumnForNumber(drawnNumber);

    // Emit to all players
    getIO().to(`game-${this.gameId}`).emit('number-drawn', {
      number: drawnNumber,
      column,
      gameId: this.gameId,
      drawnNumbers: game.drawnNumbers,
    });
  }

  /**
   * Check if player has won
   */
  async checkPlayerWin(userId: string, cardId: number): Promise<{
    hasWon: boolean;
    pattern?: string;
    message?: string;
  }> {
    const game = await Game.findById(this.gameId);
    if (!game || game.status !== GameStatus.PLAYING) {
      return { hasWon: false, message: 'Game is not active' };
    }

    const player = game.players.find(
      (p) => p.userId.toString() === userId && p.cardId === cardId
    );

    if (!player) {
      return { hasWon: false, message: 'Player not found in game' };
    }

    // Import card
    const { getCard } = await import('./cardGenerator');
    const card = await getCard(cardId);
    if (!card) {
      return { hasWon: false, message: 'Card not found' };
    }

    // Check win
    const winResult = checkWin({
      card,
      markedNumbers: player.markedNumbers,
    });

    if (winResult.hasWon) {
      // Stop the game
      this.stopGame();

      // Update game
      game.status = GameStatus.FINISHED;
      game.winner = player.userId;
      game.endTime = new Date();
      player.hasWon = true;
      await game.save();

      // Award prize
      const prize = game.prizePool;
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: prize },
      });

      // Get winner name
      const winner = await User.findById(userId);

      // Emit win to all players
      getIO().to(`game-${this.gameId}`).emit('game-won', {
        gameId: this.gameId,
        winnerId: userId,
        winnerName: winner?.firstName || 'Unknown',
        prize,
        pattern: winResult.pattern,
      });

      return {
        hasWon: true,
        pattern: winResult.pattern,
        message: 'Congratulations! You won!',
      };
    }

    return {
      hasWon: false,
      message: 'Invalid bingo. Please continue playing.',
    };
  }

  /**
   * Mark a number on player's card
   */
  async markNumber(userId: string, cardId: number, number: number): Promise<boolean> {
    const game = await Game.findById(this.gameId);
    if (!game) return false;

    const player = game.players.find(
      (p) => p.userId.toString() === userId && p.cardId === cardId
    );

    if (!player) return false;

    if (!player.markedNumbers.includes(number)) {
      player.markedNumbers.push(number);
      await game.save();

      // Emit to all players that this number was marked
      getIO().to(`game-${this.gameId}`).emit('number-marked', {
        userId,
        cardId,
        number,
        gameId: this.gameId,
      });

      return true;
    }

    return false;
  }

  /**
   * Stop the game
   */
  stopGame(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

  /**
   * Get column for number
   */
  private getColumnForNumber(num: number): 'B' | 'I' | 'N' | 'G' | 'O' {
    if (num >= 1 && num <= 15) return 'B';
    if (num >= 16 && num <= 30) return 'I';
    if (num >= 31 && num <= 45) return 'N';
    if (num >= 46 && num <= 60) return 'G';
    if (num >= 61 && num <= 75) return 'O';
    throw new Error(`Invalid number: ${num}`);
  }
}

// Store active game engines
const activeGames = new Map<string, GameEngine>();

export function getGameEngine(gameId: string): GameEngine {
  if (!activeGames.has(gameId)) {
    activeGames.set(gameId, new GameEngine(gameId));
  }
  return activeGames.get(gameId)!;
}

export function removeGameEngine(gameId: string): void {
  const engine = activeGames.get(gameId);
  if (engine) {
    engine.stopGame();
    activeGames.delete(gameId);
  }
}
