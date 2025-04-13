
type User = {
  name: string;
  id: string;
  email: string;
  dormName: string;
  roomNumber: string;
  password: string;
  role: 'student' | 'admin';
};

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

// Save user to local storage
export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('tripti_users', JSON.stringify(users));
};

// Get all users from local storage
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem('tripti_users');
  return usersJson ? JSON.parse(usersJson) : [];
};

// Find user by email
export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Authenticate user with email and password
export const authenticateUser = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Store authenticated user in session
export const setCurrentUser = (user: User): void => {
  const { password, ...userWithoutPassword } = user; // Don't store password in session
  sessionStorage.setItem('tripti_current_user', JSON.stringify(userWithoutPassword));
};

// Get current authenticated user
export const getCurrentUser = (): Omit<User, 'password'> | null => {
  const userJson = sessionStorage.getItem('tripti_current_user');
  return userJson ? JSON.parse(userJson) : null;
};

// Log out user
export const logoutUser = (): void => {
  sessionStorage.removeItem('tripti_current_user');
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getCurrentUser();
};
