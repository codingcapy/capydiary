"use client";

import { useActionState } from "react";

type SignupState = {
  error?: string;
  success?: boolean;
};

export function SignupForm({
  action,
}: {
  action: (
    prevState: SignupState | null,
    formData: FormData,
  ) => Promise<SignupState>;
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
        <button className="px-3 py-2 rounded bg-teal-500 my-1">SIGN UP</button>
      </form>

      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>Account created!</p>}
    </>
  );
}
