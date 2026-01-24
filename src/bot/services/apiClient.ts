interface UserResponse {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  balance: number;
  demo_games: number;
  referral_code: string;
  created_at: string;
  updated_at: string;
}

interface RegisterRequest {
  telegram_id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  balance?: number;
  demo_games?: number;
}

interface RegisterResponse {
  message: string;
  user: UserResponse;
}

interface GetUserResponse {
  user: UserResponse;
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

  async registerUser(data: RegisterRequest): Promise<UserResponse> {
    const response: RegisterResponse = await this.request<RegisterResponse>(
      '/api/v1/user/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.user;
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
}

export const apiClient = new ApiClient();

