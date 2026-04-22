"use client";

import { CreateEntryState } from "@/types/types";
import { useActionState, useState } from "react";
import { EntryContentInput } from "./EntryContentInput";

export function CreateEntryForm({
  action,
}: {
  action: (
    prevState: CreateEntryState | null,
    formData: FormData,
  ) => Promise<CreateEntryState>;
}) {
  const [state, formAction] = useActionState(action, null);
  const [content, setContent] = useState("");

  return (
    <form action={formAction} className="mx-auto pt-[80px] sm:w-[500px]">
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border-b w-full mb-4 p-2 outline-none"
        required
      />
      <EntryContentInput
        content={content}
        onChange={(e) => setContent(e)}
        contentPlaceholder="Content (optional)"
      />
      <input type="hidden" name="content" value={content} />
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Entry
      </button>
      {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
