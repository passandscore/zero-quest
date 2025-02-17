export interface WalletInfo {
  privateKey: string;
  address: string;
  zeroMatchPercentage: number;
  matchRuntime: number;
  matchAttempts: number;
}

export interface ChainBalance {
  name: string;
  balance: string;
  error?: string;
} 