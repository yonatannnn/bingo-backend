export const MESSAGES = {
  WELCOME: 'Welcome to Trial Bingo! 🎮',
  REGISTER_PROMPT: 'Please share your contact information to register.',
  ALREADY_REGISTERED: '❌ You are already registered! Please use /play to start playing.',
  PHONE_ALREADY_REGISTERED: '❌ This phone number is already registered with another account.',
  REGISTRATION_SUCCESS: (firstName: string, lastName: string, phone: string, balance: number, demoGames: number, referralCode: string) =>
    `✅ Registration successful!\n\n` +
    `Name: ${firstName} ${lastName}\n` +
    `Phone: ${phone}\n` +
    `Balance: ${balance}\n` +
    `Demo Games: ${demoGames}\n` +
    `Referral Code: ${referralCode}`,
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

👉 ቁጥሮቹን Copy ለማድረግ እባኮትን የፅሁፍ አካላቸውን ያጫኑ።

📱 እባክዎ የቴሌብር Transaction ID ያስገቡ:`,
  CBE_DETAILS: (amount: number, accountNumber: string) => `Amount: ${amount} Birr

(Example:- CBE(Bank): FT25106S48WP)

💵 ወደ ንግድ ባንክ ለማስገባት: ${accountNumber}

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
  WITHDRAW_BALANCE_PROMPT: (balance: number) =>
    `💰 የእርስዎ የአሁኑ ሂሳብ: ${balance} Birr\n\n` +
    `እባክዎ ምን ያህል መልሶ ማውጣት ይፈልጋሉ?`,
  WITHDRAW_SUCCESS: (amount: number, newBalance: number) =>
    `✅ Withdrawal successful!\n\n` +
    `Amount withdrawn: ${amount} Birr\n` +
    `New balance: ${newBalance} Birr\n\n` +
    `እባክዎ ይጠብቁ... የእርስዎ ክፍያ እየተላከ ነው።`,
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
};

