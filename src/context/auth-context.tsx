"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, AuthContextType } from "@/types/auth";
import { DEMO_USERS } from "@/lib/mock-data";

const AUTH_STORAGE_KEY = "enterprise_dashboard_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
        setRole(parsed.role);
      }
    } catch (e) {
      console.error("Failed to parse stored auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    // Artificial small delay for realistic authentication UX
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const demoAccount = DEMO_USERS[normalizedEmail];

    if (!demoAccount) {
      return {
        success: false,
        error: "Email tidak terdaftar. Gunakan admin@dashboard.com atau user@dashboard.com",
      };
    }

    if (demoAccount.password !== password) {
      return {
        success: false,
        error: "Password salah. Silakan coba kembali.",
      };
    }

    const authenticatedUser = demoAccount.user;
    setUser(authenticatedUser);
    setRole(authenticatedUser.role);

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch (e) {
      console.error("Failed to persist auth session", e);
    }

    return {
      success: true,
      role: authenticatedUser.role,
    };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear auth session", e);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const targetEmail = newRole === "admin" ? "admin@dashboard.com" : "user@dashboard.com";
    const targetUser = DEMO_USERS[targetEmail].user;
    setUser(targetUser);
    setRole(newRole);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetUser));
    } catch (e) {
      console.error("Failed to switch role session", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
