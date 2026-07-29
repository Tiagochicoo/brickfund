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
  ticketMin?: string;
  ticketMax?: string;
  bio?: string;
  experience?: string;
  phone?: string;
  city?: string;
  country?: string;
  termsAccepted?: boolean;
};

/** Sync the PocketBase auth token to a cookie so server-side code can read it. */
function syncAuthCookie(pb: ReturnType<typeof getPb>) {
  if (typeof document === "undefined") return;
  const token = pb.authStore.token;
  if (token) {
    const model = pb.authStore.model;
    const value = encodeURIComponent(JSON.stringify({ token, model }));
    document.cookie = `pb_auth=${value}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = "pb_auth=; path=/; max-age=0";
  }
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "pb_auth=; path=/; max-age=0";
}

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
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const pb = getPb();
    const initialUser = (pb.authStore.model as unknown as User) ?? null;
    setUser(initialUser);
    syncAuthCookie(pb);
    setInitialized(true);

    const unsubscribe = pb.authStore.onChange(() => {
      const newUser = (pb.authStore.model as unknown as User) ?? null;
      setUser(newUser);
      syncAuthCookie(pb);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const pb = getPb();
    await pb.collection("users").authWithPassword(email, password);
    syncAuthCookie(pb);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const pb = getPb();
    await pb.collection("users").create(input);
    await pb.collection("users").authWithPassword(input.email, input.password);
    syncAuthCookie(pb);
  }, []);

  const logout = useCallback(() => {
    const pb = getPb();
    pb.authStore.clear();
    clearAuthCookie();
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const pb = getPb();
    await pb.collection("users").requestPasswordReset(email);
  }, []);

  const value = useMemo(
    () => ({ user, loading: !initialized, login, register, logout, requestPasswordReset }),
    [user, initialized, login, register, logout, requestPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
