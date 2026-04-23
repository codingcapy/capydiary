import { db } from "@/db";
import { entries } from "@/db/schema";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const ENTRY_BATCH_SIZE = 20;

export type EntryListItem = {
  entryId: string;
  title: string;
  createdAt: string;
};

export type EntryPage = {
  entries: EntryListItem[];
  nextCursor: string | null;
};

type DecodedCursor = {
  createdAt: Date;
  entryId: string;
};

function encodeCursor(createdAt: Date, entryId: string) {
  return `${createdAt.toISOString()}::${entryId}`;
}

function decodeCursor(cursor: string): DecodedCursor | null {
  const [createdAt, entryId] = cursor.split("::");
  if (!createdAt || !entryId) {
    return null;
  }

  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    createdAt: parsedDate,
    entryId,
  };
}

export async function getEntryPage(
  userId: string,
  cursor?: string | null,
  limit = ENTRY_BATCH_SIZE,
): Promise<EntryPage> {
  const decodedCursor = cursor ? decodeCursor(cursor) : null;

  const rows = await db
    .select({
      entryId: entries.entryId,
      title: entries.title,
      createdAt: entries.createdAt,
    })
    .from(entries)
    .where(
      decodedCursor
        ? and(
            eq(entries.userId, userId),
            or(
              lt(entries.createdAt, decodedCursor.createdAt),
              and(
                eq(entries.createdAt, decodedCursor.createdAt),
                lt(entries.entryId, decodedCursor.entryId),
              ),
            ),
          )
        : eq(entries.userId, userId),
    )
    .orderBy(desc(entries.createdAt), desc(entries.entryId))
    .limit(limit + 1);

  const pageRows = rows.slice(0, limit);
  const lastRow = pageRows.at(-1);
  const nextCursor =
    rows.length > limit && lastRow
      ? encodeCursor(lastRow.createdAt, lastRow.entryId)
      : null;

  return {
    entries: pageRows.map((row) => ({
      entryId: row.entryId,
      title: row.title,
      createdAt: row.createdAt.toISOString(),
    })),
    nextCursor,
  };
}

export type EntryDetail = {
  entryId: string;
  title: string;
  content: string | null;
  createdAt: string;
};

export async function getEntry(
  userId: string,
  entryId: string,
): Promise<EntryDetail | null> {
  const rows = await db
    .select({
      entryId: entries.entryId,
      title: entries.title,
      content: entries.content,
      createdAt: entries.createdAt,
    })
    .from(entries)
    .where(and(eq(entries.entryId, entryId), eq(entries.userId, userId)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    entryId: row.entryId,
    title: row.title,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteEntry(userId: string, entryId: string) {
  const rows = await db
    .delete(entries)
    .where(and(eq(entries.entryId, entryId), eq(entries.userId, userId)))
    .returning({ entryId: entries.entryId });

  return rows[0] ?? null;
}
