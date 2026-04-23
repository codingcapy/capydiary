import { headers } from "next/headers";

const AUTH_WINDOW_MS = 10 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 5;

type AttemptState = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __capydiaryAuthRateLimitStore?: Map<string, AttemptState>;
};

const attemptStore =
  globalStore.__capydiaryAuthRateLimitStore ??
  (globalStore.__capydiaryAuthRateLimitStore = new Map<string, AttemptState>());

function cleanupExpiredEntries(now: number) {
  for (const [key, state] of attemptStore) {
    if (state.resetAt <= now) {
      attemptStore.delete(key);
    }
  }
}

export async function getAuthRateLimitKey(action: string, email: string) {
  const headerStore = await headers();
  const forwardedFor = headerStore
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = headerStore.get("x-real-ip")?.trim();
  const ip = forwardedFor || realIp || "unknown";

  return `${action}:${email}:${ip}`;
}

export function isAuthRateLimited(key: string) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const state = attemptStore.get(key);
  if (!state) {
    return false;
  }

  return state.count >= AUTH_MAX_ATTEMPTS;
}

export function recordAuthFailure(key: string) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const state = attemptStore.get(key);
  if (!state || state.resetAt <= now) {
    attemptStore.set(key, {
      count: 1,
      resetAt: now + AUTH_WINDOW_MS,
    });
    return;
  }

  attemptStore.set(key, {
    ...state,
    count: state.count + 1,
  });
}

export function clearAuthFailures(key: string) {
  attemptStore.delete(key);
}

export const AUTH_RATE_LIMIT_ERROR =
  "Too many attempts. Please try again in a few minutes.";
