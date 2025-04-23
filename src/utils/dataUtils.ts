
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

  // Reset users array but keep admin accounts
  if (db.users) {
    db.users = db.users.filter((user: any) => user.role === 'admin');
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

/**
 * Clears token data for a specific student
 * @param studentId The ID of the student whose data should be cleared
 */
export const clearStudentTokenData = (studentId: string): void => {
  // Clear the centralized tokens database
  const db = JSON.parse(localStorage.getItem('tripti_db') || '{}');
  
  // Remove all tokens for this student
  if (db.tokens) {
    db.tokens = db.tokens.filter((token: any) => token.studentId !== studentId);
  }
  
  // Save the updated database
  localStorage.setItem('tripti_db', JSON.stringify(db));
  
  // Clear the legacy token storage if it exists
  localStorage.removeItem(`tokens_${studentId}`);
};

/**
 * Gets token data for a specific student
 * @param studentId The ID of the student
 * @returns An array of tokens for the student
 */
export const getStudentTokenData = (studentId: string): any[] => {
  // Get from centralized database
  const db = JSON.parse(localStorage.getItem('tripti_db') || '{}');
  const tokens = db.tokens || [];
  return tokens.filter((token: any) => token.studentId === studentId);
};

