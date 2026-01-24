import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { getPaymentMethodKeyboard, getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';
import { validateTransactionId } from '../utils/validators';

export function setupDepositHandler(bot: TelegramBot) {
  // Deposit command
  bot.onText(/\/deposit/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      await bot.sendMessage(chatId, MESSAGES.PAYMENT_METHOD_PROMPT, getPaymentMethodKeyboard());
    } catch (error) {
      console.error('Deposit command error:', error);
      await bot.sendMessage(chatId, MESSAGES.ERROR_DEPOSIT);
    }
  });

  // Handle deposit payment method selection (handled in callbackHandler, but we need to handle the specific deposit callbacks here)
  // Note: This is handled in callbackHandler, but we keep the message handler here for transaction IDs

  // Handle deposit transaction IDs
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const replyToMessage = msg.reply_to_message;

    if (!text || !replyToMessage || text.startsWith('/')) {
      return;
    }

    const replyText = replyToMessage.text || '';
    
    // Handle Telebirr transaction ID
    if (replyText.includes('ቴሌብር Transaction ID') || replyText.includes('Telebirr Transaction ID')) {
      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          return;
        }

        const transactionId = text.trim();
        if (!validateTransactionId(transactionId)) {
          await bot.sendMessage(chatId, MESSAGES.INVALID_TRANSACTION_ID('CDF8QQMTVE'));
          return;
        }

        console.log(`📱 Telebirr deposit request: User ${user.telegramId}, Transaction ID: ${transactionId}`);
        await bot.sendMessage(chatId, MESSAGES.TELEBIRR_TRANSACTION_RECEIVED(transactionId));
      } catch (error) {
        console.error('Telebirr deposit error:', error);
        await bot.sendMessage(chatId, MESSAGES.ERROR_DEPOSIT);
      }
      return;
    }

    // Handle CBE transaction ID
    if (replyText.includes('CBE Transaction ID') || replyText.includes('ንግድ ባንክ')) {
      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          return;
        }

        const transactionId = text.trim();
        if (!validateTransactionId(transactionId)) {
          await bot.sendMessage(chatId, MESSAGES.INVALID_TRANSACTION_ID('FT25106S48WP'));
          return;
        }

        console.log(`🏦 CBE deposit request: User ${user.telegramId}, Transaction ID: ${transactionId}`);
        await bot.sendMessage(chatId, MESSAGES.CBE_TRANSACTION_RECEIVED(transactionId));
      } catch (error) {
        console.error('CBE deposit error:', error);
        await bot.sendMessage(chatId, MESSAGES.ERROR_DEPOSIT);
      }
      return;
    }
  });
}

