import { LoginForm } from "@/components/LoginForm";
import { LoginState } from "@/types/types";

export default function LoginPage() {
  async function login(
    prevState: LoginState | null,
    formData: FormData,
  ): Promise<LoginState> {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Missing fields" };
    }

    try {
      // login logic
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
