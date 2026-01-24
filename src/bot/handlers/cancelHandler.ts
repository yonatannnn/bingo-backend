import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { transferService } from '../services/transferService';
import { getMainMenuKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';

export function setupCancelHandler(bot: TelegramBot) {
  bot.onText(/\/cancel/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      transferService.clearPendingTransfer(chatId);

      const welcomeText = MESSAGES.WELCOME;
      const keyboard = getMainMenuKeyboard();

      try {
        const imagePath = path.join(__dirname, '../../../asset/Gemini_Generated_Image_pqmjpgpqmjpgpqmj.png');
        await bot.sendPhoto(chatId, imagePath, {
          caption: welcomeText,
          ...keyboard,
        });
      } catch (error) {
        await bot.sendMessage(chatId, welcomeText, keyboard);
      }

      await bot.sendMessage(chatId, MESSAGES.OPERATION_CANCELLED);
    } catch (error) {
      console.error('Cancel command error:', error);
      await bot.sendMessage(chatId, MESSAGES.ERROR_CANCEL);
    }
  });
}

