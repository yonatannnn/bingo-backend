import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Get all available games
 * NOTE: This endpoint requires external API implementation
 */
router.get('/list', async (req: Request, res: Response) => {
  res.status(501).json({ 
    error: 'Game endpoints require external API implementation. Please implement /api/v1/game/* endpoints in your external API.' 
  });
});

/**
 * Join a game
 * NOTE: This endpoint requires external API implementation
 */
router.post('/join', async (req: Request, res: Response) => {
  res.status(501).json({ 
    error: 'Game endpoints require external API implementation. Please implement POST /api/v1/game/join in your external API.' 
  });
});

/**
 * Get game details
 * NOTE: This endpoint requires external API implementation
 */
router.get('/:gameId', async (req: Request, res: Response) => {
  res.status(501).json({ 
    error: 'Game endpoints require external API implementation. Please implement GET /api/v1/game/:gameId in your external API.' 
  });
});

/**
 * Get all cards
 * NOTE: This endpoint requires external API implementation
 */
router.get('/cards/all', async (req: Request, res: Response) => {
  res.status(501).json({ 
    error: 'Card endpoints require external API implementation. Please implement GET /api/v1/cards/all in your external API.' 
  });
});

/**
 * Leave game
 * NOTE: This endpoint requires external API implementation
 */
router.post('/leave', async (req: Request, res: Response) => {
  res.status(501).json({ 
    error: 'Game endpoints require external API implementation. Please implement POST /api/v1/game/leave in your external API.' 
  });
});

export default router;
