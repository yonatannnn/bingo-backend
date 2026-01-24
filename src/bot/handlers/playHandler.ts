import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { getGameKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';

export function setupPlayHandler(bot: TelegramBot) {
  // Play command
  bot.onText(/\/play/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const gameUrl = `${frontendUrl}?userId=${user._id.toString()}&token=${encodeURIComponent(chatId.toString())}`;
      const keyboard = getGameKeyboard(gameUrl);

      try {
        await bot.sendPhoto(chatId, 'path/to/game-image.png', {
          caption: MESSAGES.GAME_PROMPT,
          ...keyboard,
        });
      } catch (error) {
        await bot.sendMessage(chatId, MESSAGES.GAME_PROMPT, keyboard);
      }
    } catch (error) {
      console.error('Play error:', error);
      await bot.sendMessage(chatId, MESSAGES.ERROR_PLAY);
    }
  });
}

