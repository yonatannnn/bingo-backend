import TelegramBot from 'node-telegram-bot-api';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import User from '../models/User.model';
import { generateReferralCode } from '../utils/referral';

dotenv.config();

let bot: TelegramBot;

export function initializeBot(io: Server) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
  }

  bot = new TelegramBot(token, { polling: true });

  // Welcome message with inline keyboard
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const welcomeText = 'Welcome to Trial Bingo! 🎮';
    
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📝 Register', callback_data: 'register' }],
          [{ text: '🎮 Play', callback_data: 'play' }],
          [{ text: '💰 Deposit', callback_data: 'deposit' }],
          [{ text: '📢 Join Channel', url: 'https://t.me/your_channel' }],
          [{ text: '💸 Withdraw', callback_data: 'withdraw' }],
          [{ text: '🔄 Transfer', callback_data: 'transfer' }],
        ],
      },
    };

    // Send logo image if available, otherwise just text
    try {
      await bot.sendPhoto(chatId, 'path/to/logo.png', {
        caption: welcomeText,
        ...keyboard,
      });
    } catch (error) {
      await bot.sendMessage(chatId, welcomeText, keyboard);
    }
  });

  // Register command
  bot.onText(/\/register/, async (msg) => {
    const chatId = msg.chat.id;
    const text = 'Please share your contact information to register.';
    
    const keyboard = {
      reply_markup: {
        keyboard: [
          [
            {
              text: '📱 Share Contact',
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    await bot.sendMessage(chatId, text, keyboard);
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
      const existingUser = await User.findOne({ telegramId: chatId });
      if (existingUser) {
        await bot.sendMessage(
          chatId,
          '❌ You are already registered! Please use /play to start playing.'
        );
        return;
      }

      // Normalize phone number (remove + prefix if present, keep it consistent)
      const phoneNumber = contact.phone_number?.startsWith('+') 
        ? contact.phone_number 
        : `+${contact.phone_number}`;

      // Check if phone number already exists
      const existingPhoneUser = await User.findOne({ phone: phoneNumber });
      if (existingPhoneUser) {
        await bot.sendMessage(
          chatId,
          '❌ This phone number is already registered with another account.'
        );
        return;
      }

      // Create new user
      const referralCode = await generateReferralCode();
      const user = new User({
        telegramId: chatId,
        firstName: contact.first_name || 'User',
        lastName: contact.last_name,
        phone: phoneNumber,
        balance: 5,
        demoGames: 3,
        referralCode,
      });

      await user.save();
      console.log(`✅ User registered successfully: ${user.telegramId} - ${user.firstName} (${user.phone})`);

      const successMessage =
        '✅ Registration successful!\n\n' +
        `Name: ${user.firstName}\n` +
        `Phone: ${user.phone}\n` +
        `Balance: ${user.balance}\n` +
        `Demo Games: ${user.demoGames}\n` +
        `Referral Code: ${user.referralCode}`;

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

      let errorMessage = '❌ Registration failed. Please try again.';
      
      // Provide more specific error messages
      if (error.code === 11000) {
        // Duplicate key error
        if (error.keyPattern?.telegramId) {
          errorMessage = '❌ This Telegram account is already registered.';
        } else if (error.keyPattern?.phone) {
          errorMessage = '❌ This phone number is already registered.';
        } else if (error.keyPattern?.referralCode) {
          errorMessage = '❌ Referral code conflict. Please try again.';
        }
      } else if (error.name === 'ValidationError') {
        errorMessage = `❌ Validation error: ${Object.values(error.errors).map((e: any) => e.message).join(', ')}`;
      }

      await bot.sendMessage(chatId, errorMessage);
    }
  });

  // Play command
  bot.onText(/\/play/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ telegramId: chatId });
      if (!user) {
        await bot.sendMessage(
          chatId,
          '❌ Please register first using /register'
        );
        return;
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const gameUrl = `${frontendUrl}?userId=${user._id.toString()}&token=${encodeURIComponent(chatId.toString())}`;

      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🎮 Open the Game',
                web_app: { url: gameUrl },
              },
            ],
          ],
        },
      };

      // Send game image with button
      try {
        await bot.sendPhoto(chatId, 'path/to/game-image.png', {
          caption: '🎮 Choose your game mode!',
          ...keyboard,
        });
      } catch (error) {
        await bot.sendMessage(chatId, '🎮 Choose your game mode!', keyboard);
      }
    } catch (error) {
      console.error('Play error:', error);
      await bot.sendMessage(chatId, '❌ Error opening game. Please try again.');
    }
  });

  // Handle callback queries (button presses)
  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId) return;

    try {
      switch (data) {
        case 'register':
          await bot.answerCallbackQuery(query.id);
          await bot.sendMessage(chatId, 'Please share your contact information to register.', {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: '📱 Share Contact',
                    request_contact: true,
                  },
                ],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          });
          break;

        case 'play':
          await bot.answerCallbackQuery(query.id);
          const user = await User.findOne({ telegramId: chatId });
          if (!user) {
            await bot.sendMessage(chatId, '❌ Please register first using /register');
            return;
          }

          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
          const gameUrl = `${frontendUrl}?userId=${user._id.toString()}&token=${encodeURIComponent(chatId.toString())}`;

          await bot.sendMessage(chatId, '🎮 Choose your game mode!', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🎮 Open the Game',
                    web_app: { url: gameUrl },
                  },
                ],
              ],
            },
          });
          break;

        case 'deposit':
          await bot.answerCallbackQuery(query.id);
          await bot.sendMessage(chatId, '💰 Deposit feature coming soon!');
          break;

        case 'withdraw':
          await bot.answerCallbackQuery(query.id);
          await bot.sendMessage(chatId, '💸 Withdraw feature coming soon!');
          break;

        case 'transfer':
          await bot.answerCallbackQuery(query.id);
          await bot.sendMessage(chatId, '🔄 Transfer feature coming soon!');
          break;

        default:
          await bot.answerCallbackQuery(query.id);
      }
    } catch (error) {
      console.error('Callback query error:', error);
      await bot.answerCallbackQuery(query.id, { text: '❌ Error processing request' });
    }
  });

  console.log('✅ Telegram bot initialized');
  return bot;
}

export function getBot(): TelegramBot {
  if (!bot) {
    throw new Error('Bot not initialized');
  }
  return bot;
}

