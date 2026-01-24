// User API Interfaces
interface UserResponse {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  phone_number: string;
  referal_code: string; // Note: API uses "referal" not "referral"
  created_at: string;
  updated_at: string;
}

interface WalletResponse {
  user_id: string;
  balance: number;
  demo_balance: number;
  updated_at: string;
}

interface RegisterRequest {
  telegram_id: number;
  first_name: string;
  last_name?: string;
  phone: string;
}

interface RegisterResponse {
  message: string;
  user: UserResponse;
  wallet: WalletResponse;
}

interface GetUserResponse {
  user: UserResponse;
}

interface GetWalletResponse {
  wallet: WalletResponse;
}

// Wallet API Interfaces
interface DepositRequest {
  user_id: string;
  amount: number;
  transaction_type: 'Telebirr' | 'CBE';
  transaction_id: string;
}

interface DepositResponse {
  message: string;
  transaction: {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    status: string;
    transaction_type: string;
    transaction_id: string;
    reference: string | null;
    created_at: string;
  };
}

interface WithdrawRequest {
  user_id: string;
  amount: number;
}

interface WithdrawResponse {
  message: string;
  transaction: {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    status: string;
    transaction_type: string | null;
    transaction_id: string | null;
    reference: string | null;
    created_at: string;
  };
}

interface TransferRequest {
  sender_id: string;
  receiver_id: string;
  amount: number;
}

interface TransferResponse {
  message: string;
  sender_tx: {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    status: string;
    transaction_type: string | null;
    transaction_id: string | null;
    reference: string;
    created_at: string;
  };
  receiver_tx: {
    id: string;
    user_id: string;
    type: string;
    amount: number;
    status: string;
    transaction_type: string | null;
    transaction_id: string | null;
    reference: string;
    created_at: string;
  };
}

interface ErrorResponse {
  error: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    // Remove trailing slash if present
    this.baseUrl = this.baseUrl.replace(/\/+$/, '');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData: ErrorResponse;
        try {
          errorData = await response.json() as ErrorResponse;
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json() as T;
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error(`API request failed: ${error.message || 'Unknown error'}`);
    }
  }

  // User Endpoints
  async registerUser(data: RegisterRequest): Promise<{ user: UserResponse; wallet: WalletResponse }> {
    const response: RegisterResponse = await this.request<RegisterResponse>(
      '/api/v1/user/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return { user: response.user, wallet: response.wallet };
  }

  async getUserByTelegramId(telegramId: number): Promise<UserResponse | null> {
    try {
      const response: GetUserResponse = await this.request<GetUserResponse>(
        `/api/v1/user/telegram/${telegramId}`
      );
      return response.user;
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  async getUserByPhone(phone: string): Promise<UserResponse | null> {
    try {
      const encodedPhone = encodeURIComponent(phone);
      const response: GetUserResponse = await this.request<GetUserResponse>(
        `/api/v1/user/phone?phone=${encodedPhone}`
      );
      return response.user;
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  async getUserByReferralCode(referralCode: string): Promise<UserResponse | null> {
    try {
      const encodedCode = encodeURIComponent(referralCode);
      const response: GetUserResponse = await this.request<GetUserResponse>(
        `/api/v1/user/referral/${encodedCode}`
      );
      return response.user;
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  // Wallet Endpoints
  async getWallet(userId: string): Promise<WalletResponse | null> {
    try {
      const response: GetWalletResponse = await this.request<GetWalletResponse>(
        `/api/v1/wallet/${userId}`
      );
      return response.wallet;
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  async createDeposit(data: DepositRequest): Promise<DepositResponse> {
    return await this.request<DepositResponse>(
      '/api/v1/wallet/deposit',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async createWithdraw(data: WithdrawRequest): Promise<WithdrawResponse> {
    return await this.request<WithdrawResponse>(
      '/api/v1/wallet/withdraw',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async createTransfer(data: TransferRequest): Promise<TransferResponse> {
    return await this.request<TransferResponse>(
      '/api/v1/wallet/transfer',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }
}

export const apiClient = new ApiClient();
