// Project name constant
export const PROJECT_NAME = 'Biruh Bingo';

export const MESSAGES = {
  WELCOME: `Welcome to ${PROJECT_NAME} Bingo! 🎮`,
  REGISTER_PROMPT: 'Please share your contact information to register.',
  ALREADY_REGISTERED: '❌ You are already registered! Please use /play to start playing.',
  PHONE_ALREADY_REGISTERED: '❌ This phone number is already registered with another account.',
  REGISTRATION_SUCCESS: (firstName: string, lastName: string, phone: string, balance: number, referralCode: string) =>
    `✅ Registration successful!\n\n` +
    `Name: ${firstName} ${lastName}\n` +
    `Phone: ${phone}\n` +
    `Balance: ${balance}\n` +
    `Referral Code: ${referralCode}` + '\n\n' +
    `/play to start playing`,
  NOT_REGISTERED: '❌ Please register first using /register',
  USER_NOT_FOUND: '❌ User not found. Please register first.',
  OPERATION_CANCELLED: '✅ Operation cancelled. You can start fresh!',
  GAME_PROMPT: '🎮 Choose your game mode!',
  PAYMENT_METHOD_PROMPT: 'እባክዎ የሚጠቀሙትን የክፍያ እማራጭ ይምረጡ (Telebirr ወይም Commercial Bank of Ethiopia)',
  DEPOSIT_AMOUNT_PROMPT: (transactionType: string, minAmount: number, maxAmount: number) =>
    `Payment Method: ${transactionType}\n\n` +
    `ከፍተኛ ማስገባት የሚቻለው = ${maxAmount} Birr\n` +
    `ትንሹ ማስገባት ሚቻለው = ${minAmount} Birr\n\n` +
    `ማስገባት የሚፈልጉትን የገንዘብ መጠን ያስገቡ።`,
  TELEBIRR_DETAILS: (amount: number, accountNumber: string) => `Amount: ${amount} Birr

(Example:- Telebirr: CDF8QQMTVE)

📱 ወደ ቴሌብር ለማስገባት: ${accountNumber}
👤 Name: Mikiyas Abiyot

👉 ቁጥሮቹን Copy ለማድረግ እባኮትን የፅሁፍ አካላቸውን ያጫኑ።

📱 እባክዎ የቴሌብር Transaction ID ያስገቡ:`,
  CBE_DETAILS: (amount: number, accountNumber: string) => `Amount: ${amount} Birr

(Example:- CBE(Bank): FT25106S48WP)

💵 ወደ ንግድ ባንክ ለማስገባት: ${accountNumber}
👤 Name: Mikiyas Abiyot

👉 ቁጥሮቹን Copy ለማድረግ እባኮትን የፅሁፍ አካላቸውን ያጫኑ።

🏦 እባክዎ የCBE Transaction ID ያስገቡ:`,
  TELEBIRR_TRANSACTION_RECEIVED: (amount: number, transactionId: string) =>
    `✅ የቴሌብር Transaction ID ተቀብሏል!\n\n` +
    `Amount: ${amount} Birr\n` +
    `Transaction ID: ${transactionId}\n\n` +
    `እባክዎ ትንሽ ይጠብቁ፤ ክፍያዎ እየተረጋገጠ ነው።\n\n` +
    `ክፍያዎ ከተረጋገጠ በኋላ ወደ ሂሳብዎ ይጨመራል።`,
  CBE_TRANSACTION_RECEIVED: (amount: number, transactionId: string) =>
    `✅ የCBE Transaction ID ተቀብሏል!\n\n` +
    `Amount: ${amount} Birr\n` +
    `Transaction ID: ${transactionId}\n\n` +
    `እባክዎ ትንሽ ይጠብቁ፤ ክፍያዎ እየተረጋገጠ ነው።\n\n` +
    `ክፍያዎ ከተረጋገጠ በኋላ ወደ ሂሳብዎ ይጨመራል።`,
  DEPOSIT_SESSION_EXPIRED: '❌ Deposit session expired. Please start over.',
  BALANCE_INFO: (balance: number) =>
    `💰 የእርስዎ የአሁኑ ሂሳብ\n\n` +
    `Balance: ${balance} Birr`,
  WITHDRAW_BALANCE_PROMPT: (balance: number) =>
    `💰 የእርስዎ የአሁኑ ሂሳብ: ${balance} Birr\n\n` +
    `ምን ያህል  ማውጣት ይፈልጋሉ?`,
  WITHDRAW_SUCCESS: (amount: number, newBalance: number) =>
    `Amount withdrawn: ${amount} Birr\n` +
    `New balance: ${newBalance} Birr\n\n` +
    `የመውጫ ክፍያዎ እየተፀደቀ ነው፤ እባክዎ ይጠብቁ።`,
  TRANSFER_REFERRAL_PROMPT: (balance: number) =>
    `💰 የእርስዎ የአሁኑ ሂሳብ: ${balance} Birr\n\n` +
    `እባክዎ ለማስተላለፍ የሚፈልጉትን የተጠቃሚ Referral Code ያስገቡ:`,
  TRANSFER_USER_FOUND: (firstName: string, phone: string, balance: number) =>
    `✅ User found!\n\n` +
    `Receiver: ${firstName}\n` +
    `Phone: ${phone}\n\n` +
    `እባክዎ ምን ያህል መላል ይፈልጋሉ?\n\n` +
    `Your balance: ${balance} Birr`,
  TRANSFER_SUCCESS: (amount: number, receiverName: string, newBalance: number) =>
    `✅ Transfer successful!\n\n` +
    `Amount: ${amount} Birr\n` +
    `To: ${receiverName}\n` +
    `Your new balance: ${newBalance} Birr`,
  TRANSFER_RECEIVED: (amount: number, senderName: string, newBalance: number) =>
    `💰 You received a transfer!\n\n` +
    `Amount: ${amount} Birr\n` +
    `From: ${senderName}\n` +
    `Your new balance: ${newBalance} Birr`,
  INVALID_TRANSACTION_ID: (example: string) =>
    `❌ Invalid Transaction ID format. Please enter a valid Transaction ID.\n\n(Example: ${example})`,
  TELEBIRR_DETAILS_WITH_ERROR: (amount: number, accountNumber: string, example: string) =>
    `❌ Invalid Transaction ID format. Please enter a valid Transaction ID.\n\n(Example: ${example})\n\n` +
    `Amount: ${amount} Birr\n\n` +
    `(Example:- Telebirr: ${example})\n\n` +
    `📱 ወደ ቴሌብር ለማስገባት: ${accountNumber}\n` +
    `👤 Name: Mikiyas Abiyot\n\n` +
    `👉 ቁጥሮቹን Copy ለማድረግ እባኮትን የፅሁፍ አካላቸውን ያጫኑ።\n\n` +
    `📱 እባክዎ የቴሌብር Transaction ID ያስገቡ:`,
  CBE_DETAILS_WITH_ERROR: (amount: number, accountNumber: string, example: string) =>
    `❌ Invalid Transaction ID format. Please enter a valid Transaction ID.\n\n(Example: ${example})\n\n` +
    `Amount: ${amount} Birr\n\n` +
    `(Example:- CBE(Bank): ${example})\n\n` +
    `💵 ወደ ንግድ ባንክ ለማስገባት: ${accountNumber}\n` +
    `👤 Name: Mikiyas Abiyot\n\n` +
    `👉 ቁጥሮቹን Copy ለማድረግ እባኮትን የፅሁፍ አካላቸውን ያጫኑ።\n\n` +
    `🏦 እባክዎ የCBE Transaction ID ያስገቡ:`,
  INVALID_AMOUNT: '❌ Invalid amount. Please enter a valid number greater than 0.',
  INSUFFICIENT_BALANCE: (currentBalance: number, requestedAmount: number) =>
    `❌ Insufficient balance!\n\n` +
    `Your current balance: ${currentBalance} Birr\n` +
    `Requested amount: ${requestedAmount} Birr`,
  REFERRAL_CODE_NOT_FOUND: (code: string) =>
    `❌ User not found!\n\n` +
    `Referral Code "${code}" does not exist. Please check and try again.`,
  CANNOT_TRANSFER_TO_SELF: '❌ You cannot transfer to yourself!',
  TRANSFER_SESSION_EXPIRED: '❌ Transfer session expired. Please start over.',
  RECEIVER_NOT_FOUND: '❌ Receiver not found. Please try again.',
  ERROR_GENERIC: '❌ An error occurred. Please try again.',
  ERROR_REGISTRATION: '❌ Registration failed. Please try again.',
  ERROR_DEPOSIT: '❌ Error processing deposit request. Please try again.',
  ERROR_WITHDRAW: '❌ Error processing withdraw request. Please try again.',
  ERROR_TRANSFER: '❌ Error processing transfer request. Please try again.',
  ERROR_CANCEL: '❌ Error processing cancel request. Please try again.',
  ERROR_PLAY: '❌ Error opening game. Please try again.',
  ERROR_CALLBACK: '❌ Error processing request',
  REFERRAL_CODE: (code: string) =>
    `📋 Your Referral Code:\n\n` +
    `🔗 ${code}\n\n`,
  INSTRUCTION_LINK: (url: string) =>
    `📖 Instructions\n\n` +
    `Click the link below to view instructions:\n\n` +
    `${url}`,
  JOIN_CHANNEL_LINK: (channelUsername: string) =>
    `📢 Join Our Channel\n\n` +
    `Click the link below to join:\n\n` +
    `https://t.me/${channelUsername}`,
  NO_DEPOSIT_HISTORY: '📥 No deposit history found.',
  NO_WITHDRAWAL_HISTORY: '📤 No withdrawal history found.',
  NO_TRANSFER_HISTORY: '💸 No transfer history found.',
  NO_GAME_HISTORY: '🎮 No game history found.',
  DEPOSIT_HISTORY_HEADER: '📥 Deposit History:\n\n',
  WITHDRAWAL_HISTORY_HEADER: '📤 Withdrawal History:\n\n',
  TRANSFER_HISTORY_HEADER: '💸 Transfer History:\n\n',
  GAME_HISTORY_HEADER: '🎮 Game History:\n\n',
  TRANSACTION_ITEM: (index: number, amount: number, status: string, date: string, transactionId?: string, transactionType?: string) => {
    let item = `${index}. Amount: ${amount} Birr\n`;
    item += `   Status: ${status}\n`;
    if (transactionType) {
      item += `   Type: ${transactionType}\n`;
    }
    if (transactionId) {
      item += `   Transaction ID: ${transactionId}\n`;
    }
    item += `   Date: ${date}\n`;
    return item;
  },
  TRANSFER_ITEM: (index: number, amount: number, type: string, status: string, date: string, otherPartyName?: string) => {
    let item = `${index}. ${type === 'transfer_out' ? 'Sent' : 'Received'}: ${amount} Birr\n`;
    item += `   Status: ${status}\n`;
    if (otherPartyName) {
      item += `   ${type === 'transfer_out' ? 'To' : 'From'}: ${otherPartyName}\n`;
    }
    item += `   Date: ${date}\n`;
    return item;
  },
  GAME_ITEM: (index: number, gameType: string, betAmount: number, cardId: number, state: string, isWinner: boolean, isEliminated: boolean, finishedAt: string | null) => {
    let item = `${index}. Game: ${gameType} | Bet: ${betAmount} Birr\n`;
    item += `   Card ID: ${cardId}\n`;
    item += `   Status: ${state}\n`;
    if (isWinner) {
      item += `   🏆 Winner!\n`;
    } else if (isEliminated) {
      item += `   ❌ Eliminated\n`;
    }
    if (finishedAt) {
      item += `   Finished: ${finishedAt}\n`;
    }
    return item;
  },
  SUPPORT_MESSAGE: 'እባክዎን ከዚህ በታች ያሉትን ቁልፎች በመጫን መረጃ እና ድጋፍ ማግኘት ይችላሉ።',
  CHANGE_NAME_FIRST_NAME_PROMPT: 'Enter your first name:',
  CHANGE_NAME_LAST_NAME_PROMPT: (firstName: string) => `First name: ${firstName}\n\nEnter your last name (or send /skip to leave it empty):`,
  CHANGE_NAME_SUCCESS: (firstName: string, lastName?: string) => {
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    return `✅ Name updated successfully!\n\nYour new name: ${fullName}`;
  },
  CHANGE_NAME_SESSION_EXPIRED: '❌ Name change session expired. Please start over with /change_name',
  ERROR_CHANGE_NAME: '❌ Error updating name. Please try again.',
};

