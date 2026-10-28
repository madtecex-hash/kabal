import { eq } from "drizzle-orm";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ensureDb } from "@/lib/data";
import { parseBanner } from "@/lib/parse";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const { id } = await ctx.params;
  const [row] = await db
    .update(banners)
    .set(parseBanner(await req.json()))
    .where(eq(banners.id, Number(id)))
    .returning();
  return Response.json(row ?? { error: "No encontrado" }, { status: row ? 200 : 404 });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const { id } = await ctx.params;
  await db.delete(banners).where(eq(banners.id, Number(id)));
  return Response.json({ ok: true });
}
