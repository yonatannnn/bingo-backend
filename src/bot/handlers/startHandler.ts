import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { getMainMenuKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';

export function setupStartHandler(bot: TelegramBot) {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
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
  });
}

