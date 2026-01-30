export interface PendingNameChange {
  firstName?: string;
}

class ChangeNameService {
  private pendingNameChanges = new Map<number, PendingNameChange>();

  setPendingNameChange(chatId: number, nameChange: PendingNameChange) {
    this.pendingNameChanges.set(chatId, nameChange);
  }

  getPendingNameChange(chatId: number): PendingNameChange | undefined {
    return this.pendingNameChanges.get(chatId);
  }

  clearPendingNameChange(chatId: number) {
    this.pendingNameChanges.delete(chatId);
  }
}

export const changeNameService = new ChangeNameService();

