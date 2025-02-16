import { useState } from "react";
import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { calculateZeroMatch } from "@/utils/calculations";
import { WalletInfo } from "@/types";

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  const generatePrivateKey = () => {
    const key = "0x" + randomBytes(32).toString("hex");
    const wallet = new Wallet(key);
    const zeroMatchPercentage = calculateZeroMatch(wallet.address);

    setWalletInfo({
      privateKey: key,
      address: wallet.address,
      zeroMatchPercentage
    });
  };

  return { walletInfo, generatePrivateKey };
} 