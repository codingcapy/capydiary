import Link from "next/link";
import { getSession } from "@/lib/session";
import { UserMenu } from "./UserMenu";

export async function TopNav() {
  const session = await getSession();

  return (
    <div className="fixed top-0 left-0 w-screen bg-gray-800 p-2 flex justify-between items-center border-b border-b-gray-600 z-50">
      <Link href={"/"} className="flex items-center">
        <img src="/capyness.png" alt="" className="w-[25px]" />
        <div className="ml-2 font-bold">CapyDiary</div>
      </Link>
      <div className="flex items-center">
        {session.userId ? (
          <UserMenu email={session.email} />
        ) : (
          <>
            <Link href={"/signup"} className="px-2 mx-1">
              Sign up
            </Link>
            <Link href={"/login"} className="px-2 mx-1">
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
