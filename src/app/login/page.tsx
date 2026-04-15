import { LoginForm } from "@/components/LoginForm";
import { LoginState } from "@/types/types";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default function LoginPage() {
  async function login(
    prevState: LoginState | null,
    formData: FormData,
  ): Promise<LoginState> {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) return { error: "Missing fields" };
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (!user) return { error: "Invalid email or password" };
      const valid = await verifyPassword(password, user.password);
      if (!valid) return { error: "Invalid email or password" };
      const session = await getSession();
      session.userId = user.userId;
      session.email = user.email;
      await session.save();
      redirect("/");
    } catch (err: any) {
      console.log(err);
      return { error: "Something went wrong" };
    }
  }

  return (
    <div>
      <div className="flex flex-col pt-[100px]">
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
