import { SendMessageOptions } from 'node-telegram-bot-api';

export const getMainMenuKeyboard = (): SendMessageOptions => ({
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
});

export const getContactKeyboard = (): SendMessageOptions => ({
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

export const getPaymentMethodKeyboard = (): SendMessageOptions => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: '📱 Telebirr',
          callback_data: 'deposit_telebirr',
        },
        {
          text: '🏦 CBE',
          callback_data: 'deposit_cbe',
        },
      ],
    ],
  },
});

export const getGameKeyboard = (gameUrl: string): SendMessageOptions => ({
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

export const getForceReplyKeyboard = (placeholder: string): SendMessageOptions => ({
  reply_markup: {
    force_reply: true,
    input_field_placeholder: placeholder,
  },
});

