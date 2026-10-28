import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ensureDb } from "@/lib/data";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const { id } = await ctx.params;
  const { status } = (await req.json()) as { status?: string };
  await db
    .update(orders)
    .set({ status: String(status || "nuevo") })
    .where(eq(orders.id, Number(id)));
  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const { id } = await ctx.params;
  await db.delete(orders).where(eq(orders.id, Number(id)));
  return Response.json({ ok: true });
}
