import { CONFIG } from "@/config";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function calculateZeroMatch(address: string): number {
  // Test mode returns winning percentage immediately
  if (CONFIG.TEST_MODE) {
    // Force the address to be zero address in test mode
    address = ZERO_ADDRESS;
    return CONFIG.TEST_WIN_PERCENTAGE;
  }
  
  const addressWithoutPrefix = address.slice(2).toLowerCase();
  let matchingBits = 0;

  for (let i = 0; i < addressWithoutPrefix.length; i++) {
    if (addressWithoutPrefix[i] === "0") {
      matchingBits += 4;
    } else {
      const nibble = parseInt(addressWithoutPrefix[i], 16);
      const leadingZeros = Math.clz32(nibble) - 28;
      matchingBits += leadingZeros;
      break;
    }
  }

  return (matchingBits / 160) * 100;
}

// Helper function to get test address if needed
export function getTestAddress(): string {
  return CONFIG.TEST_MODE ? ZERO_ADDRESS : "";
} 