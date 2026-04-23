"use client";

import sanitizeHtml from "sanitize-html";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { EntryActions } from "@/components/EntryActions";
import { EntryContentInput } from "@/components/EntryContentInput";

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

export function EntryDetail({
  entryId,
  initialTitle,
  initialContent,
  createdAt,
}: {
  entryId: string;
  initialTitle: string;
  initialContent: string | null;
  createdAt: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent ?? "");
  const [draftTitle, setDraftTitle] = useState(initialTitle);
  const [draftContent, setDraftContent] = useState(initialContent ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          content: draftContent,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Failed to update entry");
      }

      const updatedEntry = (await response.json()) as {
        title: string;
        content: string | null;
      };

      setTitle(updatedEntry.title);
      setContent(updatedEntry.content ?? "");
      setDraftTitle(updatedEntry.title);
      setDraftContent(updatedEntry.content ?? "");
      setIsEditing(false);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not update this entry.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditStart() {
    setDraftTitle(title);
    setDraftContent(content);
    setError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setDraftTitle(title);
    setDraftContent(content);
    setError(null);
    setIsEditing(false);
  }

  const contentHtml = sanitizeEntryContent(content);

  return (
    <div className="pt-20 sm:min-w-3xl max-w-3xl p-8 mx-auto">
      <div className="relative flex justify-between gap-4">
        {isEditing ? (
          <form className="w-full" onSubmit={handleSave}>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full border-b border-zinc-700 bg-transparent p-2 text-2xl font-bold text-zinc-100 outline-none"
              required
            />
            <p className="mt-3 text-sm text-zinc-500">
              {formatEntryDate(createdAt)}
            </p>
            <div className="mt-4">
              <EntryContentInput
                content={draftContent}
                onChange={setDraftContent}
                contentPlaceholder="Content (optional)"
              />
            </div>
            {error ? (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="cursor-pointer rounded bg-zinc-700 px-4 py-2 font-bold text-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {formatEntryDate(createdAt)}
            </p>
            <div
              className="entry-content mt-6 text-zinc-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        )}
        <EntryActions entryId={entryId} onEditClick={handleEditStart} />
      </div>
    </div>
  );
}
