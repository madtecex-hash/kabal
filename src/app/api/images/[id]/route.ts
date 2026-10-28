import { eq } from "drizzle-orm";
import { db } from "@/db";
import { images } from "@/db/schema";
import { ensureDb } from "@/lib/data";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  await ensureDb();
  const { id } = await ctx.params;
  const [row] = await db
    .select()
    .from(images)
    .where(eq(images.id, Number(id) || 0));
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(Buffer.from(row.data, "base64")), {
    headers: { "Content-Type": row.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
