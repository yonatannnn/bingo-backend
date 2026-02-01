export const validateTransactionId = (transactionId: string): boolean => {
  // Minimum 4 characters required
  return transactionId.trim().length >= 4;
};

export const validateAmount = (amount: string): { valid: boolean; value?: number; error?: string } => {
  // Accept formats: "100" or "100 Birr" (with space in the middle)
  // Remove "Birr" if present (case insensitive, with optional spaces)
  const cleaned = amount.trim().replace(/\s*birr\s*$/i, '').trim();
  
  // Validate format: should be number only or number followed by optional "Birr"
  // Check if it matches: number (with optional "Birr" at the end)
  const amountPattern = /^(\d+(?:\.\d+)?)\s*(?:birr)?$/i;
  const match = cleaned.match(amountPattern);
  
  if (!match) {
    return { valid: false, error: 'Invalid amount. Please enter a valid number (e.g., 100 or 100 Birr).' };
  }
  
  const parsed = parseFloat(match[1]);
  
  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, error: 'Invalid amount. Please enter a valid number greater than 0.' };
  }
  
  return { valid: true, value: parsed };
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber?.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
};

