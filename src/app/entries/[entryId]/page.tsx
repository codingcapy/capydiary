import { LeftNav } from "@/components/LeftNav";
import { MobileNavWrapper } from "@/components/MobileNavWrapper";
import { EntryDetail } from "@/components/EntryDetail";
import { getEntry } from "@/lib/entries";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const session = await getSession();

  if (!session.userId) {
    redirect("/login");
  }

  const { entryId } = await params;
  const entry = await getEntry(session.userId, entryId);

  if (!entry) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <MobileNavWrapper>
        <LeftNav />
      </MobileNavWrapper>
      <EntryDetail
        entryId={entry.entryId}
        initialTitle={entry.title}
        initialContent={entry.content}
        createdAt={entry.createdAt}
      />
    </div>
  );
}
