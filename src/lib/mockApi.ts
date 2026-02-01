// Centralized Mock API Gateway Utility
// Represents secure API Gateway architecture for KETNEY MVP

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// Simulated network delay
const simulateDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock API Gateway
export const mockApi = {
  // Transaction endpoints
  async getTransactions(): Promise<ApiResponse<any[]>> {
    await simulateDelay(300);
    return {
      success: true,
      data: [],
      timestamp: new Date().toISOString()
    };
  },

  async sendMoney(payload: {
    recipient: string;
    amount: number;
    network: string;
    fee: number;
  }): Promise<ApiResponse<{ transactionId: string }>> {
    await simulateDelay(800);
    return {
      success: true,
      data: { transactionId: `KTN-${Date.now()}` },
      message: "Transaction réussie",
      timestamp: new Date().toISOString()
    };
  },

  // KYC endpoints
  async verifyIdentity(documentType: string): Promise<ApiResponse<{ status: string }>> {
    await simulateDelay(3000); // Longer delay for verification
    return {
      success: true,
      data: { status: "verified" },
      message: "Identité vérifiée avec succès",
      timestamp: new Date().toISOString()
    };
  },

  async uploadKYCDocument(file: File): Promise<ApiResponse<{ documentId: string }>> {
    await simulateDelay(2000);
    return {
      success: true,
      data: { documentId: `DOC-${Date.now()}` },
      message: "Document téléchargé",
      timestamp: new Date().toISOString()
    };
  },

  // Virtual Card endpoints
  async generateVirtualCard(): Promise<ApiResponse<{
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardHolder: string;
  }>> {
    await simulateDelay(1500);
    const cardNumber = `4${Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('')}`;
    return {
      success: true,
      data: {
        cardNumber,
        cvv: String(Math.floor(Math.random() * 900) + 100),
        expiryDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${new Date().getFullYear() + 3 - 2000}`,
        cardHolder: "JEAN-PIERRE KABONGO"
      },
      timestamp: new Date().toISOString()
    };
  },

  // Exchange rates
  async getExchangeRate(): Promise<ApiResponse<{ usdToFC: number; change: number }>> {
    await simulateDelay(200);
    return {
      success: true,
      data: { usdToFC: 2850, change: 0.7 },
      timestamp: new Date().toISOString()
    };
  },

  // Admin analytics
  async getAdminStats(): Promise<ApiResponse<{
    totalTransactions: number;
    totalVolume: number;
    activeUsers: number;
    systemHealth: number;
    transactionHistory: { time: string; count: number; volume: number }[];
  }>> {
    await simulateDelay(500);
    const history = Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      count: Math.floor(Math.random() * 500) + 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000
    }));
    
    return {
      success: true,
      data: {
        totalTransactions: 45678,
        totalVolume: 2450000000,
        activeUsers: 12543,
        systemHealth: 99.7,
        transactionHistory: history
      },
      timestamp: new Date().toISOString()
    };
  },

  // Merchant QR payment
  async processMerchantPayment(payload: {
    merchantId: string;
    amount: number;
  }): Promise<ApiResponse<{ transactionId: string }>> {
    await simulateDelay(1000);
    return {
      success: true,
      data: { transactionId: `MRC-${Date.now()}` },
      message: "Paiement marchand réussi",
      timestamp: new Date().toISOString()
    };
  },

  // MFA verification
  async verifyMFA(pin: string, biometric: boolean): Promise<ApiResponse<{ verified: boolean }>> {
    await simulateDelay(500);
    return {
      success: true,
      data: { verified: pin.length === 4 && biometric },
      timestamp: new Date().toISOString()
    };
  }
};

export default mockApi;
