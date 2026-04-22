import type { User, UserRole } from "@/components/type";
import { USERS } from "@/components/mock";

const SESSION_KEY = "aim-earn:session";

export function setSession(user: User): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

/**
 * Resolve a mock user for the given email. Falls back to the distributor
 * user so any email can complete the mock login flow.
 */
export function resolveUser(email: string): User {
  const normalized = email.trim().toLowerCase();
  const match = USERS.find((u) => u.email.toLowerCase() === normalized);
  if (match) return match;
  const fallback = USERS.find((u) => u.role === "distributor") ?? USERS[0];
  return { ...fallback, email: email || fallback.email };
}

export function landingPathForRole(role: UserRole): string {
  switch (role) {
    case "distributor":
      return "/distributor";
    case "admin":
      return "/admin";
    case "affiliate":
    default:
      return "/affiliate";
  }
}
