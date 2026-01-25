import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { createDeposit } from '../services/walletService';
import { depositService } from '../services/depositService';
import { getPaymentMethodKeyboard, getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';
import { validateTransactionId, validateAmount } from '../utils/validators';
import { DEPOSIT_CONFIG } from '../config/depositConfig';

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

  // Handle deposit flow: payment method -> amount -> transaction ID
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const replyToMessage = msg.reply_to_message;

    if (!text || !replyToMessage || text.startsWith('/')) {
      return;
    }

    const replyText = replyToMessage.text || '';

    // Handle deposit amount entry (after payment method selection)
    if (replyText.includes('ማስገባት የሚፈልጉትን') || 
        replyText.includes('እባክዎ ምን ያህል መጠቀም') || 
        (replyText.includes('Payment Method') && replyText.includes('የገንዘብ መጠን'))) {
      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          depositService.clearPendingDeposit(chatId);
          return;
        }

        const pendingDeposit = depositService.getPendingDeposit(chatId);
        if (!pendingDeposit) {
          await bot.sendMessage(chatId, MESSAGES.DEPOSIT_SESSION_EXPIRED);
          return;
        }

        const amountValidation = validateAmount(text);
        if (!amountValidation.valid) {
          await bot.sendMessage(chatId, amountValidation.error || MESSAGES.INVALID_AMOUNT);
          return;
        }

        const amount = amountValidation.value!;

        // Validate amount range using config
        if (amount < DEPOSIT_CONFIG.MIN_AMOUNT || amount > DEPOSIT_CONFIG.MAX_AMOUNT) {
          await bot.sendMessage(
            chatId,
            `❌ Invalid amount. Minimum is ${DEPOSIT_CONFIG.MIN_AMOUNT} Birr and maximum is ${DEPOSIT_CONFIG.MAX_AMOUNT} Birr.`
          );
          return;
        }

        // Update pending deposit with amount
        depositService.setPendingDeposit(chatId, {
          ...pendingDeposit,
          amount,
        });

        // Ask for transaction ID
        if (pendingDeposit.transactionType === 'Telebirr') {
          await bot.sendMessage(
            chatId,
            MESSAGES.TELEBIRR_DETAILS(amount, DEPOSIT_CONFIG.TELEBIRR_ACCOUNT),
            getForceReplyKeyboard('Enter Telebirr Transaction ID')
          );
        } else if (pendingDeposit.transactionType === 'CBE') {
          await bot.sendMessage(
            chatId,
            MESSAGES.CBE_DETAILS(amount, DEPOSIT_CONFIG.CBE_ACCOUNT),
            getForceReplyKeyboard('Enter CBE Transaction ID')
          );
        }
      } catch (error) {
        console.error('Deposit amount error:', error);
        await bot.sendMessage(chatId, MESSAGES.ERROR_DEPOSIT);
        depositService.clearPendingDeposit(chatId);
      }
      return;
    }

    // Handle Telebirr transaction ID
    if (replyText.includes('ቴሌብር Transaction ID') || replyText.includes('Telebirr Transaction ID')) {
      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          depositService.clearPendingDeposit(chatId);
          return;
        }

        const pendingDeposit = depositService.getPendingDeposit(chatId);
        if (!pendingDeposit || pendingDeposit.transactionType !== 'Telebirr') {
          await bot.sendMessage(chatId, MESSAGES.DEPOSIT_SESSION_EXPIRED);
          depositService.clearPendingDeposit(chatId);
          return;
        }

        const transactionId = text.trim();
        if (!validateTransactionId(transactionId)) {
          await bot.sendMessage(chatId, MESSAGES.INVALID_TRANSACTION_ID('CDF8QQMTVE'));
          return;
        }

        // Create deposit request via API with actual amount
        await createDeposit(user._id, pendingDeposit.amount, 'Telebirr', transactionId);
        
        depositService.clearPendingDeposit(chatId);
        
        console.log(`📱 Telebirr deposit request: User ${user.telegramId}, Amount: ${pendingDeposit.amount} Birr, Transaction ID: ${transactionId}`);
        await bot.sendMessage(chatId, MESSAGES.TELEBIRR_TRANSACTION_RECEIVED(pendingDeposit.amount, transactionId));
      } catch (error: any) {
        console.error('Telebirr deposit error:', error);
        depositService.clearPendingDeposit(chatId);
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
          depositService.clearPendingDeposit(chatId);
          return;
        }

        const pendingDeposit = depositService.getPendingDeposit(chatId);
        if (!pendingDeposit || pendingDeposit.transactionType !== 'CBE') {
          await bot.sendMessage(chatId, MESSAGES.DEPOSIT_SESSION_EXPIRED);
          depositService.clearPendingDeposit(chatId);
          return;
        }

        const transactionId = text.trim();
        if (!validateTransactionId(transactionId)) {
          await bot.sendMessage(chatId, MESSAGES.INVALID_TRANSACTION_ID('FT25106S48WP'));
          return;
        }

        // Create deposit request via API with actual amount
        await createDeposit(user._id, pendingDeposit.amount, 'CBE', transactionId);
        
        depositService.clearPendingDeposit(chatId);
        
        console.log(`🏦 CBE deposit request: User ${user.telegramId}, Amount: ${pendingDeposit.amount} Birr, Transaction ID: ${transactionId}`);
        await bot.sendMessage(chatId, MESSAGES.CBE_TRANSACTION_RECEIVED(pendingDeposit.amount, transactionId));
      } catch (error: any) {
        console.error('CBE deposit error:', error);
        depositService.clearPendingDeposit(chatId);
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
