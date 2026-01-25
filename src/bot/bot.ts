import TelegramBot from 'node-telegram-bot-api';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Handlers
import { setupStartHandler } from './handlers/startHandler';
import { setupRegisterHandler } from './handlers/registerHandler';
import { setupPlayHandler } from './handlers/playHandler';
import { setupDepositHandler } from './handlers/depositHandler';
import { setupWithdrawHandler } from './handlers/withdrawHandler';
import { setupTransferHandler } from './handlers/transferHandler';
import { setupCancelHandler } from './handlers/cancelHandler';
import { setupCallbackHandler } from './handlers/callbackHandler';
import { setupBalanceHandler } from './handlers/balanceHandler';

dotenv.config();

let bot: TelegramBot;

export async function initializeBot(io: Server) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
  }

  bot = new TelegramBot(token, { polling: true });

  // Set bot commands menu
  await bot.setMyCommands([
    { command: 'register', description: 'Register to Play' },
    { command: 'withdraw', description: 'Make a Withdrawal' },
    { command: 'deposit', description: 'Make a Deposit' },
    { command: 'transfer', description: 'Transfer for a Friend' },
    { command: 'checkbalance', description: 'Check Your Balance' },
    { command: 'play', description: 'Start Playing' },
    { command: 'cancel', description: 'Cancel Current Operation' },
  ]);

  // Setup all handlers
  setupStartHandler(bot);
  setupRegisterHandler(bot);
  setupPlayHandler(bot);
  setupDepositHandler(bot);
  setupWithdrawHandler(bot);
  setupTransferHandler(bot);
  setupCancelHandler(bot);
  setupCallbackHandler(bot);
  setupBalanceHandler(bot);

  console.log('✅ Telegram bot initialized');
  return bot;
}

export function getBot(): TelegramBot {
  if (!bot) {
    throw new Error('Bot not initialized');
  }
  return bot;
}
