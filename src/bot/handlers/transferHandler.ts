import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId, findUserByReferralCode } from '../services/userService';
import { transferService } from '../services/transferService';
import { getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';
import { validateAmount } from '../utils/validators';

export function setupTransferHandler(bot: TelegramBot) {
  // Transfer command - match exactly /transfer (not /transfer_history)
  bot.onText(/^\/transfer$/, async (msg) => {
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
      // If there's already a pending transfer, user should finish or cancel first
      // But if cancelled, pending is cleared, so we can process this as new transfer
      // This check prevents processing old replies when user is in middle of transfer
      const existingPending = transferService.getPendingTransfer(chatId);
      if (existingPending) {
        // User is already in middle of a transfer - ignore this reply
        return;
      }

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
      // Check pending state first - if cleared by /cancel, ignore this message
      const pendingTransfer = transferService.getPendingTransfer(chatId);
      if (!pendingTransfer) {
        // Session expired or cancelled - ignore this message
        return;
      }

      try {
        const sender = await findUserByTelegramId(chatId);
        if (!sender) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          return;
        }

        const amountValidation = validateAmount(text);
        if (!amountValidation.valid) {
          await bot.sendMessage(chatId, amountValidation.error || MESSAGES.INVALID_AMOUNT);
          return;
        }

        const amount = amountValidation.value!;

        // Check balance (API will also check, but we check first for better UX)
        if (sender.balance < amount) {
          await bot.sendMessage(chatId, MESSAGES.INSUFFICIENT_BALANCE(sender.balance, amount));
          transferService.clearPendingTransfer(chatId);
          return;
        }

        // Execute transfer via API (atomic operation)
        const { senderBalance, receiverBalance } = await transferService.executeTransfer(
          sender._id.toString(),
          pendingTransfer.receiverId,
          amount
        );

        transferService.clearPendingTransfer(chatId);

        // Fetch receiver info for notification
        const receiver = await findUserByReferralCode(pendingTransfer.receiverReferralCode);
        const receiverName = receiver?.firstName || 'User';

        console.log(`🔄 Transfer: ${sender.telegramId} → ${receiver?.telegramId}, Amount: ${amount} Birr`);

        await bot.sendMessage(
          chatId,
          MESSAGES.TRANSFER_SUCCESS(amount, receiverName, senderBalance)
        );

        // Notify receiver
        if (receiver) {
          try {
            await bot.sendMessage(
              receiver.telegramId,
              MESSAGES.TRANSFER_RECEIVED(amount, sender.firstName, receiverBalance)
            );
          } catch (error) {
            console.error('Error notifying receiver:', error);
          }
        }
      } catch (error: any) {
        console.error('Transfer error:', error);
        const errorMsg = error.message?.toLowerCase() || '';
        let errorMessage = MESSAGES.ERROR_TRANSFER;
        
        if (errorMsg.includes('insufficient balance') || errorMsg.includes('insufficient')) {
          errorMessage = MESSAGES.INSUFFICIENT_BALANCE(0, 0);
        } else if (errorMsg.includes('invalid amount')) {
          errorMessage = MESSAGES.INVALID_AMOUNT;
        } else if (errorMsg.includes('self-transfer') || errorMsg.includes('cannot transfer to yourself')) {
          errorMessage = MESSAGES.CANNOT_TRANSFER_TO_SELF;
        }
        
        await bot.sendMessage(chatId, errorMessage);
        transferService.clearPendingTransfer(chatId);
      }
      return;
    }
  });
}
