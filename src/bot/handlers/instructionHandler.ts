import TelegramBot from 'node-telegram-bot-api';
import { MESSAGES } from '../utils/messages';

export function setupInstructionHandler(bot: TelegramBot) {
  bot.onText(/\/instruction/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const instructionUrl = `${frontendUrl}/instruction`;
      
      await bot.sendMessage(chatId, MESSAGES.INSTRUCTION_LINK(instructionUrl), {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      });
    } catch (error) {
      console.error('Instruction error:', error);
      await bot.sendMessage(chatId, '❌ Error opening instructions. Please try again.');
    }
  });
}

