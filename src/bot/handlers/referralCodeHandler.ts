import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { MESSAGES } from '../utils/messages';

export function setupReferralCodeHandler(bot: TelegramBot) {
  bot.onText(/\/referal_code/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      await bot.sendMessage(chatId, MESSAGES.REFERRAL_CODE(user.referralCode));
    } catch (error) {
      console.error('Referral code error:', error);
      await bot.sendMessage(chatId, '❌ Error fetching referral code. Please try again.');
    }
  });
}

