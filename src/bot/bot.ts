import TelegramBot from 'node-telegram-bot-api';
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
import { setupReferralCodeHandler } from './handlers/referralCodeHandler';
import { setupInstructionHandler } from './handlers/instructionHandler';
import { setupJoinChannelHandler } from './handlers/joinChannelHandler';
import { setupSupportHandler } from './handlers/supportHandler';
import {
  setupDepositHistoryHandler,
  setupWithdrawalHistoryHandler,
  setupTransferHistoryHandler,
  setupGameHistoryHandler,
} from './handlers/historyHandler';

dotenv.config();

let bot: TelegramBot;

export async function initializeBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
  }

  bot = new TelegramBot(token, { polling: true });

  // Set bot commands menu
  await bot.setMyCommands([
    { command: 'register', description: 'Register to Play' },
    { command: 'play', description: 'Start Playing' },
    { command: 'deposit', description: 'Make a Deposit' },
    { command: 'withdraw', description: 'Make a Withdrawal' },
    { command: 'transfer', description: 'Transfer for a Friend' },
    { command: 'checkbalance', description: 'Check Your Balance' },
    { command: 'cancel', description: 'Cancel Current Operation' },
    { command: 'referal_code', description: 'Get Your Referral Code' },
    { command: 'instruction', description: 'View Instructions' },
    { command: 'join_channel', description: 'Join Our Channel' },
    { command: 'deposit_history', description: 'View Deposit History' },
    { command: 'withdrawal_history', description: 'View Withdrawal History' },
    { command: 'transfer_history', description: 'View Transfer History' },
    { command: 'game_history', description: 'View Game History' },
    { command: 'support', description: 'Get Support' },
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
  setupReferralCodeHandler(bot);
  setupInstructionHandler(bot);
  setupJoinChannelHandler(bot);
  setupSupportHandler(bot);
  setupDepositHistoryHandler(bot);
  setupWithdrawalHistoryHandler(bot);
  setupTransferHistoryHandler(bot);
  setupGameHistoryHandler(bot);

  console.log('✅ Telegram bot initialized');
  return bot;
}

export function getBot(): TelegramBot {
  if (!bot) {
    throw new Error('Bot not initialized');
  }
  return bot;
}
