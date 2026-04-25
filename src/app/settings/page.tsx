import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { LeftNav } from "@/components/LeftNav";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { getSession } from "@/lib/session";
import { ChangePasswordState } from "@/types/types";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  const session = await getSession();

  async function changePassword(
    prevState: ChangePasswordState | null,
    formData: FormData,
  ): Promise<ChangePasswordState> {
    "use server";
    const password = formData.get("password") as string;
    if (!password || password.trim().length === 0)
      return { error: "Password cannot be empty." };

    try {
      const hashed = await hashPassword(password);
      await db
        .update(users)
        .set({ password: hashed })
        .where(eq(users.userId, session.userId));
      return { success: true };
    } catch {
      return { error: "Failed to update password. Please try again." };
    }
  }

  return (
    <div>
      <LeftNav />
      <div className="md:pl-[300px] pt-[80px]">
        <div className="text-4xl mb-5">Settings</div>
        <div>Email: {session.email}</div>
        <ChangePasswordForm action={changePassword} />
      </div>
    </div>
  );
}
