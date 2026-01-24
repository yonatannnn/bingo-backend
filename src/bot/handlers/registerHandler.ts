import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
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

      // Create new user
      const user = await createUser({
        telegramId: chatId,
        firstName: contact.first_name || 'User',
        lastName: contact.last_name,
        phone: contact.phone_number,
        balance: 5,
        demoGames: 3,
      });

      console.log(`✅ User registered successfully: ${user.telegramId} - ${user.firstName} (${user.phone})`);

      const successMessage = MESSAGES.REGISTRATION_SUCCESS(
        user.firstName,
        user.phone,
        user.balance,
        user.demoGames,
        user.referralCode
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
      
      if (error.code === 11000) {
        if (error.keyPattern?.telegramId) {
          errorMessage = '❌ This Telegram account is already registered.';
        } else if (error.keyPattern?.phone) {
          errorMessage = '❌ This phone number is already registered.';
        } else if (error.keyPattern?.referralCode) {
          errorMessage = '❌ Referral code conflict. Please try again.';
        } else if (error.keyPattern?.email) {
          console.log('⚠️  Email index conflict detected, attempting to fix...');
          try {
            if (mongoose.connection.db) {
              await mongoose.connection.db.collection('users').dropIndex('email_1');
              console.log('✅ Dropped email index, user should retry registration');
              errorMessage = '❌ Registration failed due to database issue. Please try again in a moment.';
            } else {
              errorMessage = '❌ Registration failed. Please contact support.';
            }
          } catch (dropError) {
            errorMessage = '❌ Registration failed. Please contact support.';
          }
        }
      } else if (error.name === 'ValidationError') {
        errorMessage = `❌ Validation error: ${Object.values(error.errors).map((e: any) => e.message).join(', ')}`;
      }

      await bot.sendMessage(chatId, errorMessage);
    }
  });
}

