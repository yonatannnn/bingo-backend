import { apiClient } from './apiClient';
import { normalizePhoneNumber } from '../utils/validators';

// Transform API response to match the expected format
export interface User {
  _id: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  phone: string;
  balance: number;
  demoGames: number;
  referralCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function transformApiUser(apiUser: any, wallet?: any): User {
  return {
    _id: apiUser.id,
    telegramId: apiUser.telegram_id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    phone: apiUser.phone_number,
    balance: wallet?.balance ?? 0, // Get balance from wallet if available
    demoGames: wallet?.demo_balance ?? 0, // Map demo_balance to demoGames
    referralCode: apiUser.referal_code, // Note: API uses "referal" not "referral"
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined,
    updatedAt: apiUser.updated_at ? new Date(apiUser.updated_at) : undefined,
  };
}

export async function findUserByTelegramId(telegramId: number): Promise<User | null> {
  try {
    const apiUser = await apiClient.getUserByTelegramId(telegramId);
    if (!apiUser) {
      return null;
    }
    
    // Also fetch wallet to get balance
    const wallet = await apiClient.getWallet(apiUser.id);
    return transformApiUser(apiUser, wallet);
  } catch (error) {
    console.error('Error finding user by Telegram ID:', error);
    return null;
  }
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  try {
    const normalizedPhone = normalizePhoneNumber(phone);
    const apiUser = await apiClient.getUserByPhone(normalizedPhone);
    if (!apiUser) {
      return null;
    }
    
    // Also fetch wallet to get balance
    const wallet = await apiClient.getWallet(apiUser.id);
    return transformApiUser(apiUser, wallet);
  } catch (error) {
    console.error('Error finding user by phone:', error);
    return null;
  }
}

export async function findUserByReferralCode(referralCode: string): Promise<User | null> {
  try {
    const apiUser = await apiClient.getUserByReferralCode(referralCode);
    if (!apiUser) {
      return null;
    }
    
    // Also fetch wallet to get balance
    const wallet = await apiClient.getWallet(apiUser.id);
    return transformApiUser(apiUser, wallet);
  } catch (error) {
    console.error('Error finding user by referral code:', error);
    return null;
  }
}

export async function createUser(data: {
  telegramId: number;
  firstName: string;
  lastName?: string;
  phone: string;
}): Promise<User> {
  const normalizedPhone = normalizePhoneNumber(data.phone);
  
  const { user: apiUser, wallet } = await apiClient.registerUser({
    telegram_id: data.telegramId,
    first_name: data.firstName,
    last_name: data.lastName,
    phone: normalizedPhone,
  });

  return transformApiUser(apiUser, wallet);
}
