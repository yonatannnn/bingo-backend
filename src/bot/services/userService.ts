import User from '../../models/User.model';
import { generateReferralCode } from '../../utils/referral';
import { normalizePhoneNumber } from '../utils/validators';

export async function findUserByTelegramId(telegramId: number) {
  return await User.findOne({ telegramId });
}

export async function findUserByPhone(phone: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  return await User.findOne({ phone: normalizedPhone });
}

export async function findUserByReferralCode(referralCode: string) {
  return await User.findOne({ referralCode });
}

export async function createUser(data: {
  telegramId: number;
  firstName: string;
  lastName?: string;
  phone: string;
  balance?: number;
  demoGames?: number;
}) {
  const normalizedPhone = normalizePhoneNumber(data.phone);
  const referralCode = await generateReferralCode();
  
  const user = new User({
    telegramId: data.telegramId,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: normalizedPhone,
    balance: data.balance ?? 5,
    demoGames: data.demoGames ?? 3,
    referralCode,
  });

  await user.save();
  return user;
}

export async function updateUserBalance(userId: string, amount: number) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.balance += amount;
  await user.save();
  return user;
}

export async function deductUserBalance(userId: string, amount: number) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.balance < amount) {
    throw new Error('Insufficient balance');
  }
  user.balance -= amount;
  await user.save();
  return user;
}

