"use client";

import { useState, useActionState, useEffect } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { ChangePasswordState } from "@/types/types";

export function ChangePasswordForm({
  action,
}: {
  action: (
    prevState: ChangePasswordState | null,
    formData: FormData,
  ) => Promise<ChangePasswordState>;
}) {
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      setEditPasswordMode(false);
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        <div>Password:</div>
        {!editPasswordMode && (
          <>
            <div className="ml-2">●●●●●●●●●●●●</div>
            <div
              className="ml-2 border rounded px-2 cursor-pointer hover:text-teal-500 transition-all ease-in-out duration-300"
              onClick={() => setEditPasswordMode(true)}
            >
              Change
            </div>
          </>
        )}
        {editPasswordMode && (
          <form action={formAction} className="ml-2 flex items-center">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="New password"
              className="sm:w-[150px] border rounded px-1"
              required
            />
            <button
              type="submit"
              className="w-[35px] cursor-pointer text-green-500 flex items-center justify-center"
            >
              <FaCheck />
            </button>
            <div
              className="cursor-pointer text-red-500 flex items-center justify-center px-1"
              onClick={() => setEditPasswordMode(false)}
            >
              <FaXmark />
            </div>
          </form>
        )}
      </div>
      {state?.success && (
        <div className="text-green-500">Password updated successfully!</div>
      )}
      {state?.error && <div className="text-yellow-500">{state.error}</div>}
    </div>
  );
}
