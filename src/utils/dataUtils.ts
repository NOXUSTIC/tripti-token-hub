
/**
 * Utility functions for managing data in the application
 */

/**
 * Clears all user data from localStorage 
 * This includes users, tokens, and configuration settings
 */
export const clearAllUserData = () => {
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  
  // Remove all user-related data
  keys.forEach(key => {
    if (
      key.startsWith('tripti_') || // User data
      key.startsWith('tokens_') ||  // Token data
      key === 'configuredMonths'    // Month configuration
    ) {
      localStorage.removeItem(key);
    }
  });
};
