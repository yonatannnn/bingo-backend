import TelegramBot from 'node-telegram-bot-api';
import { MESSAGES } from '../utils/messages';
import { getSupportKeyboard } from '../utils/keyboards';

export function setupSupportHandler(bot: TelegramBot) {
  bot.onText(/\/support/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      // Get support usernames from environment variable
      // Format: "username1,username2" or "@username1,@username2"
      const supportUsernamesEnv = process.env.SUPPORT_USERNAMES || '';
      
      if (!supportUsernamesEnv) {
        await bot.sendMessage(chatId, '❌ Support channels are not configured. Please contact the administrator.');
        return;
      }

      // Parse the usernames (split by comma and trim)
      const supportUsernames = supportUsernamesEnv
        .split(',')
        .map((username) => username.trim())
        .filter((username) => username.length > 0);

      if (supportUsernames.length === 0) {
        await bot.sendMessage(chatId, '❌ No support channels configured.');
        return;
      }

      const keyboard = getSupportKeyboard(supportUsernames);
      
      await bot.sendMessage(chatId, MESSAGES.SUPPORT_MESSAGE, keyboard);
    } catch (error) {
      console.error('Support error:', error);
      await bot.sendMessage(chatId, '❌ Error opening support. Please try again.');
    }
  });
}

