import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId, findUserByReferralCode } from '../services/userService';
import { transferService } from '../services/transferService';
import { getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';
import { validateAmount } from '../utils/validators';

export function setupTransferHandler(bot: TelegramBot) {
  // Transfer command
  bot.onText(/\/transfer/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      await bot.sendMessage(
        chatId,
        MESSAGES.TRANSFER_REFERRAL_PROMPT(user.balance),
        getForceReplyKeyboard('Enter Referral Code (e.g., 813d03b6)')
      );
    } catch (error) {
      console.error('Transfer command error:', error);
      await bot.sendMessage(chatId, MESSAGES.ERROR_TRANSFER);
    }
  });

  // Handle transfer flow
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const replyToMessage = msg.reply_to_message;

    if (!text || !replyToMessage || text.startsWith('/')) {
      return;
    }

    const replyText = replyToMessage.text || '';

    // Handle referral code entry
    if (replyText.includes('Referral Code') && replyText.includes('ማስተላለፍ')) {
      try {
        const sender = await findUserByTelegramId(chatId);
        if (!sender) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          return;
        }

        const referralCode = text.trim();
        const receiver = await findUserByReferralCode(referralCode);
        
        if (!receiver) {
          await bot.sendMessage(chatId, MESSAGES.REFERRAL_CODE_NOT_FOUND(referralCode));
          return;
        }

        if (receiver.telegramId === sender.telegramId) {
          await bot.sendMessage(chatId, MESSAGES.CANNOT_TRANSFER_TO_SELF);
          return;
        }

        transferService.setPendingTransfer(chatId, {
          receiverReferralCode: referralCode,
          receiverId: receiver._id.toString(),
        });

        await bot.sendMessage(
          chatId,
          MESSAGES.TRANSFER_USER_FOUND(receiver.firstName, receiver.phone, sender.balance),
          getForceReplyKeyboard('Enter amount to transfer')
        );
      } catch (error) {
        console.error('Transfer user lookup error:', error);
        await bot.sendMessage(chatId, MESSAGES.ERROR_TRANSFER);
      }
      return;
    }

    // Handle transfer amount entry
    if (replyText.includes('ምን ያህል መላል') && (replyText.includes('Receiver') || replyText.includes('balance'))) {
      try {
        const sender = await findUserByTelegramId(chatId);
        if (!sender) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          return;
        }

        const pendingTransfer = transferService.getPendingTransfer(chatId);
        if (!pendingTransfer) {
          await bot.sendMessage(chatId, MESSAGES.TRANSFER_SESSION_EXPIRED);
          return;
        }

        const amountValidation = validateAmount(text);
        if (!amountValidation.valid) {
          await bot.sendMessage(chatId, amountValidation.error || MESSAGES.INVALID_AMOUNT);
          return;
        }

        const amount = amountValidation.value!;

        if (sender.balance < amount) {
          await bot.sendMessage(chatId, MESSAGES.INSUFFICIENT_BALANCE(sender.balance, amount));
          transferService.clearPendingTransfer(chatId);
          return;
        }

        const { sender: updatedSender, receiver } = await transferService.executeTransfer(
          sender._id.toString(),
          pendingTransfer.receiverId,
          amount
        );

        transferService.clearPendingTransfer(chatId);

        console.log(`🔄 Transfer: ${updatedSender.telegramId} → ${receiver.telegramId}, Amount: ${amount} Birr`);

        await bot.sendMessage(
          chatId,
          MESSAGES.TRANSFER_SUCCESS(amount, receiver.firstName, updatedSender.balance)
        );

        // Notify receiver
        try {
          await bot.sendMessage(
            receiver.telegramId,
            MESSAGES.TRANSFER_RECEIVED(amount, updatedSender.firstName, receiver.balance)
          );
        } catch (error) {
          console.error('Error notifying receiver:', error);
        }
      } catch (error: any) {
        console.error('Transfer error:', error);
        const errorMessage = error.message === 'Insufficient balance'
          ? MESSAGES.INSUFFICIENT_BALANCE(0, 0)
          : MESSAGES.ERROR_TRANSFER;
        await bot.sendMessage(chatId, errorMessage);
        transferService.clearPendingTransfer(chatId);
      }
      return;
    }
  });
}

