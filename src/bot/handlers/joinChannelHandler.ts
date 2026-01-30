import TelegramBot from 'node-telegram-bot-api';
import { MESSAGES } from '../utils/messages';

export function setupJoinChannelHandler(bot: TelegramBot) {
  bot.onText(/\/join_channel/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const channelUsername = process.env.CHANNEL_USERNAME || 'your_channel';
      // Remove @ if present
      const cleanUsername = channelUsername.replace(/^@/, '');
      
      await bot.sendMessage(chatId, MESSAGES.JOIN_CHANNEL_LINK(cleanUsername), {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      });
    } catch (error) {
      console.error('Join channel error:', error);
      await bot.sendMessage(chatId, '❌ Error opening channel. Please try again.');
    }
  });
}

