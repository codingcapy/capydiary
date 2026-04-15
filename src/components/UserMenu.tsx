"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 mx-1 text-sm text-zinc-200 hover:text-white"
      >
        {email} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
          <Link
            href="/settings"
            className="block px-4 py-2 hover:bg-zinc-100 text-sm"
          >
            Settings
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 hover:bg-zinc-100 text-sm text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
