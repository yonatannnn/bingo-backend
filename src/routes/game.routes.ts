import { Router, Request, Response } from 'express';
import Game, { GameStatus } from '../models/Game.model';
import User from '../models/User.model';
import { getGameEngine, removeGameEngine } from '../game/gameEngine';
import { getAllCards } from '../game/cardGenerator';

const router = Router();

/**
 * Get all available games
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const gameTypes = [5, 7, 10, 20, 50, 100, 200];
    const games = await Promise.all(
      gameTypes.map(async (type) => {
        const activeGame = await Game.findOne({
          gameType: type,
          status: { $in: [GameStatus.WAITING, GameStatus.STARTING, GameStatus.PLAYING] },
        });

        const playerCount = activeGame?.players.length || 0;
        const prizePool = activeGame
          ? activeGame.prizePool
          : 0;

        // Calculate potential win (prize pool / number of players, or base if no players)
        const potentialWin = playerCount > 0
          ? Math.floor(prizePool / playerCount)
          : type * 2; // Base multiplier

        return {
          gameType: type,
          status: activeGame?.status || 'waiting',
          playerCount,
          prizePool,
          potentialWin,
          gameId: activeGame?._id || null,
        };
      })
    );

    res.json({ games });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Join a game
 */
router.post('/join', async (req: Request, res: Response) => {
  try {
    const { userId, gameType, cardId } = req.body;

    if (!userId || !gameType || !cardId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check balance
    if (user.balance < gameType) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Find or create game
    let game = await Game.findOne({
      gameType,
      status: { $in: [GameStatus.WAITING, GameStatus.STARTING] },
    });

    if (!game) {
      game = new Game({
        gameType,
        status: GameStatus.WAITING,
        players: [],
        prizePool: 0,
      });
    }

    // Check if player already in game
    const existingPlayer = game.players.find(
      (p: { userId: { toString: () => string } }) => p.userId.toString() === userId
    );
    if (existingPlayer) {
      return res.status(400).json({ error: 'Already in game' });
    }

    // Add player
    game.players.push({
      userId: user._id,
      cardId,
      markedNumbers: [],
      hasWon: false,
    });

    // Update prize pool
    game.prizePool += gameType;

    await game.save();

    // Start countdown if first player
    if (game.players.length === 1) {
      const engine = getGameEngine(game._id.toString());
      engine.startCountdown();
    }

    res.json({
      success: true,
      gameId: game._id,
      message: 'Joined game successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get game details
 */
router.get('/:gameId', async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId).populate('players.userId', 'firstName');

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ game });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all cards
 */
router.get('/cards/all', async (req: Request, res: Response) => {
  try {
    const cards = await getAllCards();
    res.json({ cards });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Leave game
 */
router.post('/leave', async (req: Request, res: Response) => {
  try {
    const { userId, gameId } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Remove player
    game.players = game.players.filter(
      (p: { userId: { toString: () => string } }) => p.userId.toString() !== userId
    );

    // Update prize pool
    const player = game.players.find((p: { userId: { toString: () => string } }) => p.userId.toString() === userId);
    if (player) {
      game.prizePool -= game.gameType;
    }

    await game.save();

    // Stop countdown if no players
    if (game.players.length === 0) {
      const engine = getGameEngine(gameId);
      engine.stopCountdown();
    }

    res.json({ success: true, message: 'Left game successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

