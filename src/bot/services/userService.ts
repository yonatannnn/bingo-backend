import { apiClient } from './apiClient';
import { normalizePhoneNumber } from '../utils/validators';

// Transform API response to match the expected format
interface User {
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

function transformApiUser(apiUser: any): User {
  return {
    _id: apiUser.id,
    telegramId: apiUser.telegram_id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    phone: apiUser.phone,
    balance: apiUser.balance,
    demoGames: apiUser.demo_games,
    referralCode: apiUser.referral_code,
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined,
    updatedAt: apiUser.updated_at ? new Date(apiUser.updated_at) : undefined,
  };
}

export async function findUserByTelegramId(telegramId: number): Promise<User | null> {
  try {
    const apiUser = await apiClient.getUserByTelegramId(telegramId);
    return apiUser ? transformApiUser(apiUser) : null;
  } catch (error) {
    console.error('Error finding user by Telegram ID:', error);
    return null;
  }
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  try {
    const normalizedPhone = normalizePhoneNumber(phone);
    const apiUser = await apiClient.getUserByPhone(normalizedPhone);
    return apiUser ? transformApiUser(apiUser) : null;
  } catch (error) {
    console.error('Error finding user by phone:', error);
    return null;
  }
}

export async function findUserByReferralCode(referralCode: string): Promise<User | null> {
  try {
    const apiUser = await apiClient.getUserByReferralCode(referralCode);
    return apiUser ? transformApiUser(apiUser) : null;
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
  balance?: number;
  demoGames?: number;
}): Promise<User> {
  const normalizedPhone = normalizePhoneNumber(data.phone);
  
  const apiUser = await apiClient.registerUser({
    telegram_id: data.telegramId,
    first_name: data.firstName,
    last_name: data.lastName,
    phone: normalizedPhone,
    balance: data.balance ?? 5,
    demo_games: data.demoGames ?? 3,
  });

  return transformApiUser(apiUser);
}

// Note: These functions still use direct DB access as they're not in the API yet
// You may need to add API endpoints for these or handle them differently
export async function updateUserBalance(userId: string, amount: number): Promise<User> {
  // TODO: Implement via API when endpoint is available
  throw new Error('updateUserBalance not yet implemented via API');
}

export async function deductUserBalance(userId: string, amount: number): Promise<User> {
  // TODO: Implement via API when endpoint is available
  throw new Error('deductUserBalance not yet implemented via API');
}
