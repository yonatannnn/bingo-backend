import { SendMessageOptions } from 'node-telegram-bot-api';

export const getMainMenuKeyboard = (channelUsername?: string): SendMessageOptions => {
  const buttons: any[] = [];
  
  // Row 1: Register | Play
  buttons.push([
    { text: '📝 Register', callback_data: 'register' },
    { text: '🎮 Play', callback_data: 'play' }
  ]);

  // Row 2: Deposit | Join Channel (if available) or Withdraw
  if (channelUsername) {
    const cleanUsername = channelUsername.replace(/^@/, '');
    buttons.push([
      { text: '💰 Deposit', callback_data: 'deposit' },
      { text: '📢 Join Channel', url: `https://t.me/${cleanUsername}` }
    ]);
  } else {
    buttons.push([
      { text: '💰 Deposit', callback_data: 'deposit' },
      { text: '💸 Withdraw', callback_data: 'withdraw' }
    ]);
  }

  // Row 3: Withdraw | Transfer (or just Transfer if channel button was in row 2)
  if (channelUsername) {
    buttons.push([
      { text: '💸 Withdraw', callback_data: 'withdraw' },
      { text: '🔄 Transfer', callback_data: 'transfer' }
    ]);
  } else {
    buttons.push([
      { text: '🔄 Transfer', callback_data: 'transfer' }
    ]);
  }

  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
};

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

export const getSupportKeyboard = (supportUsernames: string[]): SendMessageOptions => {
  // Remove @ if present and create buttons
  const buttons = supportUsernames.map((username) => {
    const cleanUsername = username.replace(/^@/, '');
    return [
      {
        text: `📞 @${cleanUsername}`,
        url: `https://t.me/${cleanUsername}`,
      },
    ];
  });

  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
};

export const getJoinChannelKeyboard = (channelUsername: string): SendMessageOptions => {
  const cleanUsername = channelUsername.replace(/^@/, '');
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📢 Join Channel',
            url: `https://t.me/${cleanUsername}`,
          },
        ],
      ],
    },
  };
};

export const getInstructionKeyboard = (instructionUrl: string): SendMessageOptions => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📖 View Instructions',
            web_app: { url: instructionUrl },
          },
        ],
      ],
    },
  };
};

