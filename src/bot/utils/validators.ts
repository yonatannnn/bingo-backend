export const validateTransactionId = (transactionId: string): boolean => {
  // Alphanumeric, 6-20 characters
  return /^[A-Z0-9]{6,20}$/i.test(transactionId.trim());
};

export const validateAmount = (amount: string): { valid: boolean; value?: number; error?: string } => {
  // Remove "Birr" if present (case insensitive, with optional space)
  const cleaned = amount.trim().replace(/\s*birr\s*$/i, '').trim();
  
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, error: 'Invalid amount. Please enter a valid number (e.g., 100 or 100 Birr).' };
  }
  
  return { valid: true, value: parsed };
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber?.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
};

