import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { createDeposit } from '../services/walletService';
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

        // Create deposit request via API
        // Note: Using minimum amount (50) as placeholder - admin will verify and update the actual amount
        await createDeposit(user._id, 50, 'Telebirr', transactionId);
        
        console.log(`📱 Telebirr deposit request: User ${user.telegramId}, Transaction ID: ${transactionId}`);
        await bot.sendMessage(chatId, MESSAGES.TELEBIRR_TRANSACTION_RECEIVED(transactionId));
      } catch (error: any) {
        console.error('Telebirr deposit error:', error);
        const errorMsg = error.message?.toLowerCase() || '';
        if (errorMsg.includes('invalid amount') || errorMsg.includes('amount')) {
          await bot.sendMessage(chatId, '❌ Invalid amount. Please contact support.');
        } else {
          await bot.sendMessage(chatId, MESSAGES.ERROR_DEPOSIT);
        }
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

        // Create deposit request via API
        // Note: Using minimum amount (50) as placeholder - admin will verify and update the actual amount
        await createDeposit(user._id, 50, 'CBE', transactionId);
        
        console.log(`🏦 CBE deposit request: User ${user.telegramId}, Transaction ID: ${transactionId}`);
        await bot.sendMessage(chatId, MESSAGES.CBE_TRANSACTION_RECEIVED(transactionId));
      } catch (error: any) {
        console.error('CBE deposit error:', error);
        const errorMsg = error.message?.toLowerCase() || '';
        if (errorMsg.includes('invalid amount') || errorMsg.includes('amount')) {
          await bot.sendMessage(chatId, '❌ Invalid amount. Please contact support.');
        } else {
          await bot.sendMessage(chatId, MESSAGES.ERROR_DEPOSIT);
        }
      }
      return;
    }
  });
}
