import TelegramBot from 'node-telegram-bot-api';
import { getWalletByTelegramId } from '../services/walletService';
import { MESSAGES } from '../utils/messages';

export function setupBalanceHandler(bot: TelegramBot) {
  // Check balance command
  bot.onText(/\/checkbalance/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const wallet = await getWalletByTelegramId(chatId);
      
      if (!wallet) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      await bot.sendMessage(chatId, MESSAGES.BALANCE_INFO(wallet.balance));
    } catch (error) {
      console.error('Check balance error:', error);
      await bot.sendMessage(chatId, '❌ Error fetching balance. Please try again.');
    }
  });
}

