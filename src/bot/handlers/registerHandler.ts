import TelegramBot from 'node-telegram-bot-api';
import { findUserByTelegramId, findUserByPhone, createUser } from '../services/userService';
import { getContactKeyboard } from '../utils/keyboards';
import { MESSAGES } from '../utils/messages';

export function setupRegisterHandler(bot: TelegramBot) {
  // Register command
  bot.onText(/\/register/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, MESSAGES.REGISTER_PROMPT, getContactKeyboard());
  });

  // Handle contact sharing
  bot.on('contact', async (msg) => {
    const chatId = msg.chat.id;
    const contact = msg.contact;

    if (!contact) {
      return;
    }

    try {
      // Check if user already exists
      const existingUser = await findUserByTelegramId(chatId);
      if (existingUser) {
        await bot.sendMessage(chatId, MESSAGES.ALREADY_REGISTERED);
        return;
      }

      // Check if phone number already exists
      const existingPhoneUser = await findUserByPhone(contact.phone_number);
      if (existingPhoneUser) {
        await bot.sendMessage(chatId, MESSAGES.PHONE_ALREADY_REGISTERED);
        return;
      }

      // Create new user (balance and demoGames are set automatically by API)
      const user = await createUser({
        telegramId: chatId,
        firstName: contact.first_name || 'User',
        lastName: contact.last_name,
        phone: contact.phone_number,
      });

      console.log(`✅ User registered successfully: ${user.telegramId} - ${user.firstName} (${user.phone})`);

      const successMessage = MESSAGES.REGISTRATION_SUCCESS(
        user.firstName,
        user.lastName ?? '',
        user.phone,
        user.balance,
        user.referralCode ?? ''
      );

      await bot.sendMessage(chatId, successMessage);
    } catch (error: any) {
      console.error('Registration error details:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        chatId,
        contact: contact ? {
          phone: contact.phone_number,
          firstName: contact.first_name,
        } : null,
      });

      let errorMessage = MESSAGES.ERROR_REGISTRATION;
      
      // Handle API errors
      if (error.message) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('already registered') || errorMsg.includes('duplicate') || errorMsg.includes('exists')) {
          if (errorMsg.includes('telegram')) {
            errorMessage = '❌ This Telegram account is already registered.';
          } else if (errorMsg.includes('phone')) {
            errorMessage = '❌ This phone number is already registered.';
          } else {
            errorMessage = '❌ User already exists. Please try again.';
          }
        } else if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
          errorMessage = `❌ Validation error: ${error.message}`;
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorMessage = '❌ Network error. Please check your connection and try again.';
        } else if (error.message.includes('409') || errorMsg.includes('already exists')) {
          errorMessage = '❌ This Telegram account is already registered.';
        }
      }

      await bot.sendMessage(chatId, errorMessage);
    }
  });
}

