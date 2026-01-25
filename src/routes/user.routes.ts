import { Router, Request, Response } from 'express';
import { apiClient } from '../bot/services/apiClient';

const router = Router();

/**
 * Get user by ID (via external API)
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Note: External API doesn't have a direct user by ID endpoint
    // This would need to be added to the external API
    // For now, return an error
    res.status(501).json({ 
      error: 'This endpoint requires external API support. Please use /api/v1/user/telegram/:telegram_id instead.' 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user by Telegram ID (via external API)
 */
router.get('/telegram/:telegramId', async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.params;
    const user = await apiClient.getUserByTelegramId(parseInt(telegramId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        referal_code: user.referal_code,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
