"use client";

import { LoginState } from "@/types/types";
import Link from "next/link";
import { useActionState } from "react";

export function LoginForm({
  action,
}: {
  action: (
    prevState: LoginState | null,
    formData: FormData,
  ) => Promise<LoginState>;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <>
      <form action={formAction} className="flex flex-col w-[300px]">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border rounded p-1 my-1"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border rounded p-1 my-1"
          required
        />
        <button className="px-3 py-2 rounded bg-teal-500 my-1">LOGIN</button>
      </form>
      {state?.error && <p>{state.error}</p>}
      <div className="flex">
        <div className="mr-2">Don't have an account?</div>{" "}
        <Link href={"/signup"} className="font-bold text-teal-400">
          Sign up
        </Link>
      </div>
    </>
  );
}
