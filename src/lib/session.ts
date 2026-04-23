import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionPassword() {
  const password = process.env.SESSION_SECRET;

  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set and at least 32 characters long.",
    );
  }

  return password;
}

export interface SessionData {
  userId: string;
  email: string;
}

export const sessionOptions: SessionOptions = {
  password: getSessionPassword(),
  cookieName: "capydiary-session",
  ttl: SESSION_TTL_SECONDS,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
