import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { depositService } from '../services/depositService';
import { getContactKeyboard, getPaymentMethodKeyboard, getGameKeyboard, getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';
import { DEPOSIT_CONFIG } from '../config/depositConfig';

export function setupCallbackHandler(bot: TelegramBot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) return;

    try {
      await bot.answerCallbackQuery(query.id);

      switch (data) {
        case 'register':
          await bot.sendMessage(chatId, MESSAGES.REGISTER_PROMPT, getContactKeyboard());
          break;

        case 'play':
          const user = await findUserByTelegramId(chatId);
          if (!user) {
            await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
            return;
          }

          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
          const gameUrl = `${frontendUrl}?userId=${user._id.toString()}&token=${encodeURIComponent(chatId.toString())}`;
          await bot.sendMessage(chatId, MESSAGES.GAME_PROMPT, getGameKeyboard(gameUrl));
          break;

        case 'deposit':
          const depositUser = await findUserByTelegramId(chatId);
          if (!depositUser) {
            await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
            return;
          }
          await bot.sendMessage(chatId, MESSAGES.PAYMENT_METHOD_PROMPT, getPaymentMethodKeyboard());
          break;

        case 'deposit_telebirr':
          // Store pending deposit with transaction type
          depositService.setPendingDeposit(chatId, {
            amount: 0, // Will be set when user provides amount
            transactionType: 'Telebirr',
          });
          // Ask for amount first
          await bot.sendMessage(
            chatId,
            MESSAGES.DEPOSIT_AMOUNT_PROMPT('Telebirr', DEPOSIT_CONFIG.MIN_AMOUNT, DEPOSIT_CONFIG.MAX_AMOUNT),
            getForceReplyKeyboard(`Enter amount (${DEPOSIT_CONFIG.MIN_AMOUNT}-${DEPOSIT_CONFIG.MAX_AMOUNT} Birr)`)
          );
          break;

        case 'deposit_cbe':
          // Store pending deposit with transaction type
          depositService.setPendingDeposit(chatId, {
            amount: 0, // Will be set when user provides amount
            transactionType: 'CBE',
          });
          // Ask for amount first
          await bot.sendMessage(
            chatId,
            MESSAGES.DEPOSIT_AMOUNT_PROMPT('CBE', DEPOSIT_CONFIG.MIN_AMOUNT, DEPOSIT_CONFIG.MAX_AMOUNT),
            getForceReplyKeyboard(`Enter amount (${DEPOSIT_CONFIG.MIN_AMOUNT}-${DEPOSIT_CONFIG.MAX_AMOUNT} Birr)`)
          );
          break;

        case 'withdraw':
          const withdrawUser = await findUserByTelegramId(chatId);
          if (!withdrawUser) {
            await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
            return;
          }
          await bot.sendMessage(
            chatId,
            MESSAGES.WITHDRAW_BALANCE_PROMPT(withdrawUser.balance),
            {
              reply_markup: {
                force_reply: true,
                input_field_placeholder: 'Enter amount to withdraw (e.g., 100)',
              },
            }
          );
          break;

        case 'transfer':
          const transferUser = await findUserByTelegramId(chatId);
          if (!transferUser) {
            await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
            return;
          }
          await bot.sendMessage(
            chatId,
            MESSAGES.TRANSFER_REFERRAL_PROMPT(transferUser.balance),
            {
              reply_markup: {
                force_reply: true,
                input_field_placeholder: 'Enter Referral Code (e.g., 813d03b6)',
              },
            }
          );
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Callback query error:', error);
      await bot.answerCallbackQuery(query.id, { text: MESSAGES.ERROR_CALLBACK });
    }
  });
}

