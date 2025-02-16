export function calculateZeroMatch(address: string): number {
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