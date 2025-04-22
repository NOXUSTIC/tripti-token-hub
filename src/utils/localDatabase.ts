/**
 * Local Database Management System using localStorage
 * 
 * This module provides a structured way to work with data persisted in localStorage
 * organized as tables for different entities.
 */

// Database structure and types
export interface DatabaseSchema {
  users: User[];
  tokens: TokenRecord[];
  loginLogs: LoginLog[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  dormName: string;
  roomNumber: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface TokenRecord {
  id: string;
  month: string;
  studentId: string;
  studentName: string;
  dormName: string;
  roomNumber: string;
  date: string;
  foodType?: 'chicken' | 'beef' | 'mutton' | 'fish';
}

export interface LoginLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'admin';
  action: 'login' | 'logout';
  timestamp: string;
}

// Initialize database if not exists
const initDatabase = (): void => {
  if (!localStorage.getItem('tripti_db')) {
    const initialDb: DatabaseSchema = {
      users: [],
      tokens: [],
      loginLogs: []
    };
    localStorage.setItem('tripti_db', JSON.stringify(initialDb));
  }
};

// Get database
const getDatabase = (): DatabaseSchema => {
  initDatabase();
  return JSON.parse(localStorage.getItem('tripti_db') || '{}');
};

// Save database
const saveDatabase = (db: DatabaseSchema): void => {
  localStorage.setItem('tripti_db', JSON.stringify(db));
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// User Operations
export const findUserByEmail = (email: string): User | undefined => {
  const db = getDatabase();
  return db.users.find(user => user.email === email);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const db = getDatabase();
  
  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  saveDatabase(db);
  
  return newUser;
};

export const getAllUsers = (): User[] => {
  const db = getDatabase();
  return db.users;
};

export const getStudents = (): User[] => {
  const db = getDatabase();
  return db.users.filter(user => user.role === 'student');
};

// Authentication operations
export const authenticateUser = (email: string, password: string): User | null => {
  const db = getDatabase();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Log the login
    logUserAction(user.id, user.name, user.role, 'login');
    return user;
  }
  
  return null;
};

export const logoutUser = (userId: string, userName: string, userRole: 'student' | 'admin'): void => {
  logUserAction(userId, userName, userRole, 'logout');
};

const logUserAction = (
  userId: string, 
  userName: string, 
  userRole: 'student' | 'admin', 
  action: 'login' | 'logout'
): void => {
  const db = getDatabase();
  
  const log: LoginLog = {
    id: generateId(),
    userId,
    userName,
    userRole,
    action,
    timestamp: new Date().toISOString()
  };
  
  db.loginLogs.push(log);
  saveDatabase(db);
};

// Token Operations
export const createTokenRecord = (
  month: string,
  studentId: string,
  studentName: string,
  dormName: string,
  roomNumber: string,
  foodType?: 'chicken' | 'beef' | 'mutton' | 'fish'
): TokenRecord => {
  const db = getDatabase();
  
  const tokenRecord: TokenRecord = {
    id: generateId(),
    month,
    studentId,
    studentName,
    dormName,
    roomNumber,
    date: new Date().toISOString(),
    foodType
  };
  
  db.tokens.push(tokenRecord);
  saveDatabase(db);
  
  return tokenRecord;
};

export const getTokensByMonth = (month: string): TokenRecord[] => {
  const db = getDatabase();
  return db.tokens.filter(token => token.month === month);
};

export const getTokensByStudent = (studentId: string): TokenRecord[] => {
  const db = getDatabase();
  return db.tokens.filter(token => token.studentId === studentId);
};

export const getTokenStatisticsByMonth = (): Array<{
  month: string;
  total: number;
  used: number;
  remaining: number;
}> => {
  const db = getDatabase();
  const configuredMonths = JSON.parse(localStorage.getItem('configuredMonths') || '[]');
  
  // Default tokens per month
  const DEFAULT_TOKENS_PER_MONTH = 400;
  
  return configuredMonths.map((month: string) => {
    const usedTokens = db.tokens.filter(token => token.month === month).length;
    
    return {
      month,
      total: DEFAULT_TOKENS_PER_MONTH,
      used: usedTokens,
      remaining: DEFAULT_TOKENS_PER_MONTH - usedTokens
    };
  });
};

// Get total token counts
export const getTotalTokenCount = (): number => {
  // This is the total capacity per month
  return 400;
};

export const getUsedTokensCount = (month: string): number => {
  const db = getDatabase();
  return db.tokens.filter(token => token.month === month).length;
};

export const getRemainingTokensCount = (month: string): number => {
  const totalTokens = getTotalTokenCount();
  const usedTokens = getUsedTokensCount(month);
  return totalTokens - usedTokens;
};

// Login Logs Operations
export const getLoginLogs = (): LoginLog[] => {
  const db = getDatabase();
  return db.loginLogs;
};

// Initialize the database when this module loads
initDatabase();
