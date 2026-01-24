import { createTransfer } from './walletService';

export interface PendingTransfer {
  receiverReferralCode: string;
  receiverId: string;
}

class TransferService {
  private pendingTransfers = new Map<number, PendingTransfer>();

  setPendingTransfer(chatId: number, transfer: PendingTransfer) {
    this.pendingTransfers.set(chatId, transfer);
  }

  getPendingTransfer(chatId: number): PendingTransfer | undefined {
    return this.pendingTransfers.get(chatId);
  }

  clearPendingTransfer(chatId: number) {
    this.pendingTransfers.delete(chatId);
  }

  async executeTransfer(
    senderId: string,
    receiverId: string,
    amount: number
  ): Promise<{ senderBalance: number; receiverBalance: number }> {
    return await createTransfer(senderId, receiverId, amount);
  }
}

export const transferService = new TransferService();
