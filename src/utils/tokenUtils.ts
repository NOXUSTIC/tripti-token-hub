
import { 
  getTokensByMonth, 
  getUsedTokensCount, 
  getRemainingTokensCount,
  getTotalTokenCount,
  getTokenStatisticsByMonth
} from './localDatabase';

/**
 * Gets the number of used tokens for a specific month
 */
export const getUsedTokens = (month: string): number => {
  // Get all tokens directly from localStorage
  const db = JSON.parse(localStorage.getItem('tripti_db') || '{}');
  const allTokens = db.tokens || [];
  
  // If month is provided, filter by month, otherwise return all tokens
  if (month) {
    return allTokens.filter((token: any) => token.month === month).length;
  }
  
  return allTokens.length;
};

/**
 * Gets the total number of tokens available for each month
 */
export const getTotalTokens = (): number => {
  return getTotalTokenCount();
};

/**
 * Gets the remaining tokens for a specific month
 */
export const getRemainingTokens = (month: string): number => {
  const total = getTotalTokens();
  const used = getUsedTokens(month);
  return total - used;
};

/**
 * Gets token statistics for all configured months
 */
export const getTokenStatistics = (): Array<{
  month: string;
  total: number;
  used: number;
  remaining: number;
}> => {
  return getTokenStatisticsByMonth();
};
