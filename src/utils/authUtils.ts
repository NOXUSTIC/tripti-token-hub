
import { 
  findUserByEmail as dbFindUserByEmail, 
  authenticateUser as dbAuthenticateUser,
  createUser as dbCreateUser,
  logoutUser as dbLogoutUser,
  User
} from './localDatabase';

type UserWithoutPassword = Omit<User, 'password'>;

// Check if the email is valid (student or admin domain)
export const isValidEmail = (email: string): boolean => {
  const studentDomain = '@g.bracu.ac.bd';
  const adminDomain = '@bracu.ac.bd';
  
  return email.endsWith(studentDomain) || email.endsWith(adminDomain);
};

// Determine role based on email domain
export const getUserRole = (email: string): 'student' | 'admin' | null => {
  if (email.endsWith('@g.bracu.ac.bd')) {
    return 'student';
  } else if (email.endsWith('@bracu.ac.bd')) {
    return 'admin';
  }
  return null;
};

// Find user by email (re-exported from localDatabase)
export const findUserByEmail = (email: string): User | undefined => {
  return dbFindUserByEmail(email);
};

// Save user to local storage
export const saveUser = (user: Omit<User, 'id' | 'createdAt'>): void => {
  dbCreateUser(user);
};

// Get all users from local storage
export const getUsers = (): UserWithoutPassword[] => {
  const users = JSON.parse(localStorage.getItem('tripti_users') || '[]');
  return users.map((user: User) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

// Authenticate user with email and password
export const authenticateUser = (email: string, password: string): UserWithoutPassword | null => {
  const user = dbAuthenticateUser(email, password);
  if (user) {
    const { password, ...userWithoutPassword } = user; 
    return userWithoutPassword;
  }
  return null;
};

// Store authenticated user in session
export const setCurrentUser = (user: UserWithoutPassword): void => {
  sessionStorage.setItem('tripti_current_user', JSON.stringify(user));
};

// Get current authenticated user
export const getCurrentUser = (): UserWithoutPassword | null => {
  const userJson = sessionStorage.getItem('tripti_current_user');
  return userJson ? JSON.parse(userJson) : null;
};

// Log out user
export const logoutUser = (): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    dbLogoutUser(currentUser.id, currentUser.name, currentUser.role);
  }
  sessionStorage.removeItem('tripti_current_user');
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getCurrentUser();
};
