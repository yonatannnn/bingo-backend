import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId, deductUserBalance } from '../services/userService';
import { getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';
import { validateAmount } from '../utils/validators';

export function setupWithdrawHandler(bot: TelegramBot) {
  // Withdraw command
  bot.onText(/\/withdraw/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      await bot.sendMessage(
        chatId,
        MESSAGES.WITHDRAW_BALANCE_PROMPT(user.balance),
        getForceReplyKeyboard('Enter amount to withdraw (e.g., 100)')
      );
    } catch (error) {
      console.error('Withdraw command error:', error);
      await bot.sendMessage(chatId, MESSAGES.ERROR_WITHDRAW);
    }
  });

  // Handle withdraw amount
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const replyToMessage = msg.reply_to_message;

    if (!text || !replyToMessage || text.startsWith('/')) {
      return;
    }

    const replyText = replyToMessage.text || '';
    
    if (replyText.includes('ምን ያህል መልሶ ማውጣት') || 
        replyText.includes('withdrawal amount') || 
        (replyText.includes('withdraw') && replyText.includes('balance'))) {
      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          return;
        }

        const amountValidation = validateAmount(text);
        if (!amountValidation.valid) {
          await bot.sendMessage(chatId, amountValidation.error || MESSAGES.INVALID_AMOUNT);
          return;
        }

        const amount = amountValidation.value!;

        // Check balance
        if (user.balance < amount) {
          await bot.sendMessage(chatId, MESSAGES.INSUFFICIENT_BALANCE(user.balance, amount));
          return;
        }

        // Deduct balance
        const updatedUser = await deductUserBalance(user._id.toString(), amount);
        console.log(`💸 Withdrawal: User ${user.telegramId} withdrew ${amount} Birr. New balance: ${updatedUser.balance}`);

        await bot.sendMessage(chatId, MESSAGES.WITHDRAW_SUCCESS(amount, updatedUser.balance));
      } catch (error: any) {
        console.error('Withdraw error:', error);
        const errorMessage = error.message === 'Insufficient balance' 
          ? MESSAGES.INSUFFICIENT_BALANCE(0, 0)
          : MESSAGES.ERROR_WITHDRAW;
        await bot.sendMessage(chatId, errorMessage);
      }
      return;
    }
  });
}

