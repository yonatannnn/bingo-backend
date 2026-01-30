import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { apiClient } from '../services/apiClient';
import { MESSAGES } from '../utils/messages';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

function formatStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': '⏳ Pending',
    'completed': '✅ Completed',
    'failed': '❌ Failed',
    'cancelled': '🚫 Cancelled',
  };
  return statusMap[status] || status;
}

export function setupDepositHistoryHandler(bot: TelegramBot) {
  bot.onText(/\/deposit history/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      const history = await apiClient.getDepositHistory(user._id);
      
      if (history.count === 0) {
        await bot.sendMessage(chatId, MESSAGES.NO_DEPOSIT_HISTORY);
        return;
      }

      let message = MESSAGES.DEPOSIT_HISTORY_HEADER;
      history.deposits.forEach((deposit, index) => {
        message += MESSAGES.TRANSACTION_ITEM(
          index + 1,
          deposit.amount,
          formatStatus(deposit.status),
          formatDate(deposit.created_at),
          deposit.transaction_id,
          deposit.transaction_type
        );
        message += '\n';
      });

      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Deposit history error:', error);
      await bot.sendMessage(chatId, '❌ Error fetching deposit history. Please try again.');
    }
  });
}

export function setupWithdrawalHistoryHandler(bot: TelegramBot) {
  bot.onText(/\/withdrawal history/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      const history = await apiClient.getWithdrawalHistory(user._id);
      
      if (history.count === 0) {
        await bot.sendMessage(chatId, MESSAGES.NO_WITHDRAWAL_HISTORY);
        return;
      }

      let message = MESSAGES.WITHDRAWAL_HISTORY_HEADER;
      history.withdrawals.forEach((withdrawal, index) => {
        message += MESSAGES.TRANSACTION_ITEM(
          index + 1,
          withdrawal.amount,
          formatStatus(withdrawal.status),
          formatDate(withdrawal.created_at)
        );
        message += '\n';
      });

      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Withdrawal history error:', error);
      await bot.sendMessage(chatId, '❌ Error fetching withdrawal history. Please try again.');
    }
  });
}

export function setupTransferHistoryHandler(bot: TelegramBot) {
  bot.onText(/\/transfer history/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      const history = await apiClient.getTransferHistory(user._id);
      
      if (history.count === 0) {
        await bot.sendMessage(chatId, MESSAGES.NO_TRANSFER_HISTORY);
        return;
      }

      let message = MESSAGES.TRANSFER_HISTORY_HEADER;
      history.transfers.forEach((transfer, index) => {
        message += MESSAGES.TRANSFER_ITEM(
          index + 1,
          transfer.amount,
          transfer.type,
          formatStatus(transfer.status),
          formatDate(transfer.created_at),
          transfer.reference
        );
        message += '\n';
      });

      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Transfer history error:', error);
      await bot.sendMessage(chatId, '❌ Error fetching transfer history. Please try again.');
    }
  });
}

export function setupGameHistoryHandler(bot: TelegramBot) {
  bot.onText(/\/game_history/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      // Note: Game history endpoint is not available in the API docs
      // This is a placeholder implementation
      await bot.sendMessage(chatId, MESSAGES.NO_GAME_HISTORY);
    } catch (error) {
      console.error('Game history error:', error);
      await bot.sendMessage(chatId, '❌ Error fetching game history. Please try again.');
    }
  });
}

