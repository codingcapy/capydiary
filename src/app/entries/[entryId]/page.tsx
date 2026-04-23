import { LeftNav } from "@/components/LeftNav";
import { getEntry } from "@/lib/entries";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";

function formatEntryDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(createdAt));
}

function sanitizeEntryContent(content: string | null) {
  return sanitizeHtml(content ?? "", {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

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

  const contentHtml = sanitizeEntryContent(entry.content);

  return (
    <div>
      <LeftNav />
      <div className="sm:ml-50 pt-20 max-w-3xl p-8">
        <h1 className="text-2xl font-bold text-zinc-100">{entry.title}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {formatEntryDate(entry.createdAt)}
        </p>
        <div
          className="entry-content mt-6 text-zinc-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
