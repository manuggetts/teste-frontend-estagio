// Credentials data
const credentials = {
  users: [
    {
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
    },
    {
      username: "user",
      password: "user123",
      email: "user@example.com",
    },
    {
      username: "teste",
      password: "teste123",
      email: "teste@example.com",
    },
  ],
};

export interface User {
  username: string;
  password: string;
  email: string;
}

export const authenticateUser = async (
  username: string,
  password: string
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = credentials.users.find(
    (u) => u.username === username && u.password === password
  );

  return !!user;
};

export const registerUser = async (
  username: string,
  password: string,
  email: string
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = credentials.users.find((u) => u.username === username);
  if (existingUser) {
    return false;
  }

  // In a real app, you would save to database
  // For this demo, we'll just return true
  return true;
};

// rememberMe para decidir onde salvar o token
export const login = (token: string, rememberMe: boolean = false): void => {
  if (typeof window === "undefined") return;

  if (rememberMe) {
    // persiste após fechar o navegador
    localStorage.setItem("auth_token", token);
  } else {
    // expira quando a aba é fechada
    sessionStorage.setItem("auth_token", token);
  }
};

// Verifica se tem token para autenticação
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  return !!(localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token"));
};

export const logout = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
};