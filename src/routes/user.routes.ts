import { Router, Request, Response } from 'express';
import User from '../models/User.model';

const router = Router();

/**
 * Get user by ID
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        balance: user.balance,
        demoGames: user.demoGames,
        referralCode: user.referralCode,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user by Telegram ID
 */
router.get('/telegram/:telegramId', async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.params;
    const user = await User.findOne({ telegramId: parseInt(telegramId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        balance: user.balance,
        demoGames: user.demoGames,
        referralCode: user.referralCode,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

