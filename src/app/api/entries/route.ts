import { getEntryPage } from "@/lib/entries";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const page = await getEntryPage(session.userId, cursor);

  return NextResponse.json(page);
}
