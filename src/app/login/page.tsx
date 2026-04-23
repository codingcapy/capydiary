import { LoginForm } from "@/components/LoginForm";
import { LoginState } from "@/types/types";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  AUTH_RATE_LIMIT_ERROR,
  clearAuthFailures,
  getAuthRateLimitKey,
  isAuthRateLimited,
  recordAuthFailure,
} from "@/lib/authRateLimit";
import { verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) {
    redirect("/dashboard");
  }

  async function login(
    prevState: LoginState | null,
    formData: FormData,
  ): Promise<LoginState> {
    "use server";
    const email = (formData.get("email") as string | null)
      ?.trim()
      .toLowerCase();
    const password = formData.get("password") as string;
    if (!email || !password) return { error: "Missing fields" };

    const rateLimitKey = await getAuthRateLimitKey("login", email);
    if (isAuthRateLimited(rateLimitKey)) {
      return { error: AUTH_RATE_LIMIT_ERROR };
    }

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (!user) {
        recordAuthFailure(rateLimitKey);
        return { error: "Invalid email or password" };
      }
      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        recordAuthFailure(rateLimitKey);
        return { error: "Invalid email or password" };
      }
      const session = await getSession();
      session.userId = user.userId;
      session.email = user.email;
      await session.save();
      clearAuthFailures(rateLimitKey);
      redirect("/dashboard");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof err.digest === "string" &&
        err.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }

      recordAuthFailure(rateLimitKey);
      console.error("Login failed", {
        code:
          err && typeof err === "object" && "code" in err
            ? err.code
            : undefined,
        name:
          err && typeof err === "object" && "name" in err
            ? err.name
            : undefined,
      });
      return { error: "Something went wrong" };
    }
  }

  return (
    <div>
      <div className="flex flex-col pt-25">
        <div className="mx-auto">
          <div className="text-center text-4xl font-bold text-teal-300 mb-2">
            Login
          </div>
          <LoginForm action={login} />
        </div>
      </div>
    </div>
  );
}
