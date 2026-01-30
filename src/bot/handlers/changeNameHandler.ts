import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId } from '../services/userService';
import { apiClient } from '../services/apiClient';
import { changeNameService } from '../services/changeNameService';
import { getForceReplyKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';

export function setupChangeNameHandler(bot: TelegramBot) {
  // Change name command
  bot.onText(/^\/change_name$/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await findUserByTelegramId(chatId);
      if (!user) {
        await bot.sendMessage(chatId, MESSAGES.NOT_REGISTERED);
        return;
      }

      // Initialize pending name change
      changeNameService.setPendingNameChange(chatId, {});

      await bot.sendMessage(
        chatId,
        MESSAGES.CHANGE_NAME_FIRST_NAME_PROMPT,
        getForceReplyKeyboard('Enter your first name')
      );
    } catch (error) {
      console.error('Change name command error:', error);
      await bot.sendMessage(chatId, MESSAGES.ERROR_CHANGE_NAME);
    }
  });

  // Handle name change flow: first name -> last name -> update
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const replyToMessage = msg.reply_to_message;

    if (!text || !replyToMessage || text.startsWith('/')) {
      return;
    }

    const replyText = replyToMessage.text || '';

    // Handle first name entry
    if (replyText.includes('Enter your first name') || replyText.includes('CHANGE_NAME_FIRST_NAME_PROMPT')) {
      // Check pending state first - if cleared by /cancel, ignore this message
      const pendingNameChange = changeNameService.getPendingNameChange(chatId);
      if (!pendingNameChange) {
        // Session expired or cancelled - ignore this message
        return;
      }

      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          changeNameService.clearPendingNameChange(chatId);
          return;
        }

        const firstName = text.trim();
        if (!firstName || firstName.length === 0) {
          await bot.sendMessage(chatId, '❌ First name cannot be empty. Please enter your first name.');
          return;
        }

        // Update pending name change with first name
        changeNameService.setPendingNameChange(chatId, {
          firstName,
        });

        // Ask for last name
        await bot.sendMessage(
          chatId,
          MESSAGES.CHANGE_NAME_LAST_NAME_PROMPT(firstName),
          getForceReplyKeyboard('Enter your last name or /skip')
        );
      } catch (error) {
        console.error('Change name first name error:', error);
        await bot.sendMessage(chatId, MESSAGES.ERROR_CHANGE_NAME);
        changeNameService.clearPendingNameChange(chatId);
      }
      return;
    }

    // Handle last name entry (or skip)
    if (replyText.includes('Enter your last name') || replyText.includes('last name')) {
      // Check pending state first - if cleared by /cancel, ignore this message
      const pendingNameChange = changeNameService.getPendingNameChange(chatId);
      if (!pendingNameChange || !pendingNameChange.firstName) {
        // Session expired or cancelled - ignore this message
        return;
      }

      try {
        const user = await findUserByTelegramId(chatId);
        if (!user) {
          await bot.sendMessage(chatId, MESSAGES.USER_NOT_FOUND);
          changeNameService.clearPendingNameChange(chatId);
          return;
        }

        let lastName: string | undefined = undefined;
        const textLower = text.trim().toLowerCase();
        
        // Check if user wants to skip last name
        if (textLower !== '/skip' && textLower !== 'skip') {
          lastName = text.trim();
          // Allow empty last name
          if (lastName.length === 0) {
            lastName = undefined;
          }
        }

        // Update user name via API
        const updatedUser = await apiClient.updateUserName(
          user._id,
          pendingNameChange.firstName!,
          lastName
        );

        changeNameService.clearPendingNameChange(chatId);

        console.log(`📝 Name updated: User ${user.telegramId}, New name: ${pendingNameChange.firstName} ${lastName || ''}`);

        await bot.sendMessage(
          chatId,
          MESSAGES.CHANGE_NAME_SUCCESS(pendingNameChange.firstName, lastName)
        );
      } catch (error: any) {
        console.error('Change name error:', error);
        changeNameService.clearPendingNameChange(chatId);
        const errorMsg = error.message?.toLowerCase() || '';
        let errorMessage = MESSAGES.ERROR_CHANGE_NAME;
        
        if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
          errorMessage = `❌ Validation error: ${error.message}`;
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorMessage = '❌ Network error. Please check your connection and try again.';
        }
        
        await bot.sendMessage(chatId, errorMessage);
      }
      return;
    }
  });
}

