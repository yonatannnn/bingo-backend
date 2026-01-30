import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { transferService } from '../services/transferService';
import { depositService } from '../services/depositService';
import { changeNameService } from '../services/changeNameService';
import { getMainMenuKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';

export function setupCancelHandler(bot: TelegramBot) {
  bot.onText(/\/cancel/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      transferService.clearPendingTransfer(chatId);
      depositService.clearPendingDeposit(chatId);
      changeNameService.clearPendingNameChange(chatId);

      const welcomeText = MESSAGES.WELCOME;
      // Get channel username from environment variable
      const channelUsername = process.env.CHANNEL_USERNAME;
      const keyboard = getMainMenuKeyboard(channelUsername);

      try {
        const imagePath = path.join(__dirname, '../../../asset/bingo.png');
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

