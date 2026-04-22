import { CreateEntryForm } from "@/components/CreateEntryForm";
import { LeftNav } from "@/components/LeftNav";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { redirect } from "next/navigation";
import { CreateEntryState } from "@/types/types";

export default function NewEntryPage() {
  async function createEntry(
    prevState: CreateEntryState | null,
    formData: FormData,
  ): Promise<CreateEntryState> {
    "use server";

    try {
      const session = await getSession();

      if (!session.userId) {
        return { error: "You must be logged in to create an entry" };
      }

      const title = formData.get("title") as string;
      const content = formData.get("content") as string;

      if (!title || !title.trim()) {
        return { error: "Title is required" };
      }

      await db.insert(entries).values({
        userId: session.userId,
        title: title.trim(),
        content: content || null,
      });

      redirect("/dashboard");
    } catch (error) {
      // Re-throw NextJS redirect errors
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Error creating entry:", error);
      return { error: "Failed to create entry. Please try again." };
    }
  }

  return (
    <div className="flex flex-col">
      <LeftNav />
      <CreateEntryForm action={createEntry} />
    </div>
  );
}
