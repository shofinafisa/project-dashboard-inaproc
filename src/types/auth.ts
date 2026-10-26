export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
}

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}
