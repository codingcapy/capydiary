import { SignupForm } from "@/components/SignupForm";
import { db } from "@/db";
import { users } from "@/db/schema";
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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) {
      return { error: "Missing fields" };
    }
    try {
      const hashedPassword = await hashPassword(password);
      await db.insert(users).values({
        email,
        password: hashedPassword,
      });
      return { success: true };
    } catch (err: any) {
      console.log(err);
      if (err.code === "23505") {
        console.log(err);
        return { error: "Email already exists" };
      }
      console.log(err);
      return { error: "Something went wrong" };
    }
  }

  return (
    <div className="flex flex-col pt-[100px]">
      <div className="mx-auto">
        <div className="text-center text-4xl font-bold text-teal-300 mb-2">
          Sign Up
        </div>
        <SignupForm action={signup} />
      </div>
    </div>
  );
}
