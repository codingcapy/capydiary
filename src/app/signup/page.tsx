import { SignupForm } from "@/components/SignupForm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  AUTH_RATE_LIMIT_ERROR,
  clearAuthFailures,
  getAuthRateLimitKey,
  isAuthRateLimited,
  recordAuthFailure,
} from "@/lib/authRateLimit";
import { hashPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { SignupState } from "@/types/types";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await getSession();
  if (session.userId) {
    redirect("/dashboard");
  }

  async function signup(
    prevState: SignupState | null,
    formData: FormData,
  ): Promise<SignupState> {
    "use server";
    const email = (formData.get("email") as string | null)
      ?.trim()
      .toLowerCase();
    const password = formData.get("password") as string;
    if (!email || !password) {
      return { error: "Missing fields" };
    }

    const rateLimitKey = await getAuthRateLimitKey("signup", email);
    if (isAuthRateLimited(rateLimitKey)) {
      return { error: AUTH_RATE_LIMIT_ERROR };
    }

    try {
      const hashedPassword = await hashPassword(password);
      await db.insert(users).values({
        email,
        password: hashedPassword,
      });
      clearAuthFailures(rateLimitKey);
      return { success: true };
    } catch (err: unknown) {
      recordAuthFailure(rateLimitKey);
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "23505"
      ) {
        return { error: "Could not create account." };
      }

      console.error("Signup failed", {
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
    <div className="flex flex-col pt-25">
      <div className="mx-auto">
        <div className="text-center text-4xl font-bold text-teal-300 mb-2">
          Sign Up
        </div>
        <SignupForm action={signup} />
      </div>
    </div>
  );
}
