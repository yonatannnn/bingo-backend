import TelegramBot from 'node-telegram-bot-api';
import { MESSAGES } from '../utils/messages';
import { getJoinChannelKeyboard } from '../utils/keyboards';

export function setupJoinChannelHandler(bot: TelegramBot) {
  bot.onText(/\/join_channel/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const channelUsername = process.env.CHANNEL_USERNAME || 'your_channel';
      const keyboard = getJoinChannelKeyboard(channelUsername);
      
      await bot.sendMessage(chatId, MESSAGES.JOIN_CHANNEL_LINK(channelUsername.replace(/^@/, '')), keyboard);
    } catch (error) {
      console.error('Join channel error:', error);
      await bot.sendMessage(chatId, '❌ Error opening channel. Please try again.');
    }
  });
}

