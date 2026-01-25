import crypto from 'crypto';
import { apiClient } from '../bot/services/apiClient';

/**
 * Generate a unique referral code
 * Checks against external API to ensure uniqueness
 */
export async function generateReferralCode(): Promise<string> {
  let code: string;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loop

  while (exists && attempts < maxAttempts) {
    code = crypto.randomBytes(4).toString('hex');
    
    // Check if code exists in external API
    try {
      const user = await apiClient.getUserByReferralCode(code);
      exists = !!user;
    } catch (error) {
      // If API error (like 404), code doesn't exist
      exists = false;
    }
    
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique referral code after multiple attempts');
  }

  return code!;
}
