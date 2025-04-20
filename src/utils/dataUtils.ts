
/**
 * Utility functions for managing data in the application
 */

/**
 * Clears all user data from localStorage 
 * This includes users, tokens, and configuration settings
 */
export const clearAllUserData = () => {
  const db = JSON.parse(localStorage.getItem('tripti_db') || '{}');
  
  // Reset tokens to empty array
  if (db.tokens) {
    db.tokens = [];
  }
  
  // Reset login logs to empty array
  if (db.loginLogs) {
    db.loginLogs = [];
  }
  
  // Reset the database
  localStorage.setItem('tripti_db', JSON.stringify(db));
  
  // Also clear any legacy token data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('tokens_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear session storage for current user
  sessionStorage.removeItem('tripti_current_user');
};

