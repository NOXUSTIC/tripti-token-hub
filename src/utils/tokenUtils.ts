
/**
 * Token utility functions to manage token allocation and tracking
 */

// Default number of tokens per week per dorm
const DEFAULT_TOKENS_PER_WEEK = 400;

/**
 * Gets the number of used tokens for a specific month and year
 */
export const getUsedTokens = (month: string): number => {
  try {
    // Get all tokens from localStorage
    const keys = Object.keys(localStorage);
    const tokenKeys = keys.filter(key => key.startsWith('tokens_'));
    
    // Count tokens that match the specified month
    let usedTokenCount = 0;
    
    tokenKeys.forEach(key => {
      const tokenData = JSON.parse(localStorage.getItem(key) || '{}');
      
      // Check if the token month matches the requested month
      if (tokenData.month === month) {
        usedTokenCount++;
      }
    });
    
    return usedTokenCount;
  } catch (error) {
    console.error('Error getting used tokens:', error);
    return 0;
  }
};

/**
 * Gets the total number of tokens available for each week
 */
export const getTotalTokens = (): number => {
  return DEFAULT_TOKENS_PER_WEEK;
};

/**
 * Gets the remaining tokens for a specific month and year
 */
export const getRemainingTokens = (month: string): number => {
  const totalTokens = getTotalTokens();
  const usedTokens = getUsedTokens(month);
  return totalTokens - usedTokens;
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
  try {
    // Get configured months
    const configuredMonths = JSON.parse(localStorage.getItem('configuredMonths') || '[]');
    
    // Calculate statistics for each month
    return configuredMonths.map((month: string) => {
      const total = getTotalTokens();
      const used = getUsedTokens(month);
      const remaining = total - used;
      
      return {
        month,
        total,
        used,
        remaining
      };
    });
  } catch (error) {
    console.error('Error getting token statistics:', error);
    return [];
  }
};
