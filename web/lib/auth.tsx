"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPb } from "./pb";
import type { Role, User } from "./types";

type RegisterInput = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  role: Role;
  company?: string;
  location?: string;
  investorType?: "individual" | "firm" | "fund";
  accredited?: boolean;
  budgetMin?: number;
  budgetMax?: number;
  phone?: string;
};

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pb = getPb();
  const [user, setUser] = useState<User | null>(
    (pb.authStore.model as unknown as User) ?? null
  );

  // Set up PocketBase auth change listener
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      const newUser = (pb.authStore.model as unknown as User) ?? null;
      setUser(newUser);
    });

    return unsubscribe;
  }, [pb.authStore]);

  const login = useCallback(
    async (email: string, password: string) => {
      await pb.collection("users").authWithPassword(email, password);
    },
    [pb]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await pb.collection("users").create(input);
      await pb.collection("users").authWithPassword(input.email, input.password);
    },
    [pb]
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, [pb]);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      await pb.collection("users").requestPasswordReset(email);
    },
    [pb]
  );

  const value = useMemo(
    () => ({ user, loading: false, login, register, logout, requestPasswordReset }),
    [user, login, register, logout, requestPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}