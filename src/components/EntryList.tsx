"use client";

import { EntryListItem, EntryPage } from "@/lib/entries";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";

function formatEntryDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(createdAt));
}

export function EntryList({
  initialEntries,
  initialCursor,
}: {
  initialEntries: EntryListItem[];
  initialCursor: string | null;
}) {
  const [items, setItems] = useState(initialEntries);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useEffectEvent(async () => {
    if (!nextCursor || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/entries?cursor=${encodeURIComponent(nextCursor)}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }

      const data = (await response.json()) as EntryPage;
      setItems((current) => [...current, ...data.entries]);
      setNextCursor(data.nextCursor);
    } catch {
      setError("Could not load more entries.");
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (!nextCursor || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (observerEntries) => {
        if (observerEntries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [nextCursor]);

  if (items.length === 0) {
    return (
      <div className="px-3 py-4 text-sm text-zinc-400">No entries yet.</div>
    );
  }

  return (
    <div className="pt-3">
      <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Entries
      </div>
      <div className="space-y-1">
        {items.map((entry) => (
          <Link
            key={entry.entryId}
            href={`/entries/${entry.entryId}`}
            className="block px-3 py-2 transition-colors hover:bg-zinc-900/70"
          >
            <div className="truncate text-sm font-medium text-zinc-100">
              {entry.title}
            </div>
            <div className="pt-1 text-xs text-zinc-500">
              {formatEntryDate(entry.createdAt)}
            </div>
          </Link>
        ))}
      </div>
      {error ? (
        <div className="px-3 pt-3 text-xs text-red-400">{error}</div>
      ) : null}
      {nextCursor ? (
        <div ref={sentinelRef} className="px-3 py-4 text-xs text-zinc-500">
          {isLoading ? "Loading more..." : "Scroll for more"}
        </div>
      ) : (
        <div className="px-3 py-4 text-xs text-zinc-600">No more entries</div>
      )}
    </div>
  );
}
