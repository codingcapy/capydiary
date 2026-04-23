import { EntryList } from "@/components/EntryList";
import { getEntryPage } from "@/lib/entries";
import { getSession } from "@/lib/session";
import Link from "next/link";

export async function LeftNav() {
  const session = await getSession();
  const initialPage = session.userId
    ? await getEntryPage(session.userId)
    : { entries: [], nextCursor: null };

  return (
    <div className="fixed top-0 left-0 h-screen w-[200px] overflow-y-auto border-r border-r-gray-600 pt-20">
      <div className="sticky top-0 border-b border-b-gray-700 bg-black/95 backdrop-blur">
        <Link href="/new" className="block w-74.5 bg-teal-500 px-3 py-2">
          + New Entry
        </Link>
      </div>
      <EntryList
        initialEntries={initialPage.entries}
        initialCursor={initialPage.nextCursor}
      />
    </div>
  );
}
