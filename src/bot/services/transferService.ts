import User from '../../models/User.model';

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
  ): Promise<{ sender: any; receiver: any }> {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    return { sender, receiver };
  }
}

export const transferService = new TransferService();

