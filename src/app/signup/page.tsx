import { db } from "@/db";
import { users } from "@/db/schema";

export default function SignupPage() {
  async function signup(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("Missing fields");
    }

    await db.insert(users).values({
      email,
      password, // ⚠️ hash later
    });

    console.log("User created:", email);
  }

  return (
    <div className="flex flex-col pt-[100px]">
      <div className="mx-auto">
        <div className="text-center text-4xl font-bold text-teal-300">
          Sign Up
        </div>
        <form action={signup} className="flex flex-col w-[300px]">
          <input
            type="email"
            id="email"
            name="email"
            className="border rounded p-1 my-1"
          />
          <input
            type="password"
            id="password"
            name="password"
            className="border rounded p-1 my-1"
          />
          <button className="px-3 py-2 rounded bg-teal-500 my-1 cursor-pointer hover:bg-teal-400 transition-all ease-in-out duration-300">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}
