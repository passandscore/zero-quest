import { WalletInfo } from "@/types";

const TOP_MATCHES_KEY = 'zero_quest_top_matches';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function updateTopMatches(newMatch: WalletInfo): WalletInfo[] {
  if (!isClient()) return [newMatch];

  // Get current matches
  const currentMatches: WalletInfo[] = JSON.parse(
    localStorage.getItem(TOP_MATCHES_KEY) || '[]'
  );

  // Add new match and sort by percentage
  const allMatches = [...currentMatches, newMatch]
    .sort((a, b) => b.zeroMatchPercentage - a.zeroMatchPercentage)
    .slice(0, 10); // Keep only top 10

  // Save back to localStorage
  localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(allMatches));
  
  return allMatches;
}

export function getTopMatches(): WalletInfo[] {
  if (!isClient()) return [];
  try {
    const matches = JSON.parse(localStorage.getItem(TOP_MATCHES_KEY) || '[]');
    return Array.isArray(matches) ? matches : [];
  } catch (error) {
    console.error('Error parsing top matches:', error);
    return [];
  }
} 