
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
  return getUsedTokensCount(month);
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
  return getRemainingTokensCount(month);
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
