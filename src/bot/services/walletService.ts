import { apiClient } from './apiClient';

export interface Wallet {
  userId: string;
  balance: number;
  demoBalance: number;
  updatedAt: Date;
}

export async function getWallet(userId: string): Promise<Wallet | null> {
  try {
    const wallet = await apiClient.getWallet(userId);
    if (!wallet) {
      return null;
    }
    return {
      userId: wallet.user_id,
      balance: wallet.balance,
      demoBalance: wallet.demo_balance,
      updatedAt: new Date(wallet.updated_at),
    };
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
}

export async function getWalletByTelegramId(telegramId: number): Promise<Wallet | null> {
  try {
    const wallet = await apiClient.getWalletByTelegramId(telegramId);
    if (!wallet) {
      return null;
    }
    return {
      userId: wallet.user_id,
      balance: wallet.balance,
      demoBalance: wallet.demo_balance,
      updatedAt: new Date(wallet.updated_at),
    };
  } catch (error) {
    console.error('Error getting wallet by Telegram ID:', error);
    return null;
  }
}

export async function createDeposit(
  userId: string,
  amount: number,
  transactionType: 'Telebirr' | 'CBE',
  transactionId: string
): Promise<{ transactionId: string; status: string }> {
  const response = await apiClient.createDeposit({
    user_id: userId,
    amount,
    transaction_type: transactionType,
    transaction_id: transactionId,
  });
  
  return {
    transactionId: response.transaction.id,
    status: response.transaction.status,
  };
}

export async function createWithdraw(
  userId: string,
  amount: number
): Promise<{ transactionId: string; status: string; newBalance: number }> {
  const response = await apiClient.createWithdraw({
    user_id: userId,
    amount,
  });
  
  // Fetch updated wallet to get new balance
  const wallet = await getWallet(userId);
  
  return {
    transactionId: response.transaction.id,
    status: response.transaction.status,
    newBalance: wallet?.balance ?? 0,
  };
}

export async function createTransfer(
  senderId: string,
  receiverId: string,
  amount: number
): Promise<{ senderBalance: number; receiverBalance: number }> {
  const response = await apiClient.createTransfer({
    sender_id: senderId,
    receiver_id: receiverId,
    amount,
  });
  
  // Fetch updated wallets to get new balances
  const senderWallet = await getWallet(senderId);
  const receiverWallet = await getWallet(receiverId);
  
  return {
    senderBalance: senderWallet?.balance ?? 0,
    receiverBalance: receiverWallet?.balance ?? 0,
  };
}

