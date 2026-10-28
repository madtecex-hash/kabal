import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ensureDb, mapProduct } from "@/lib/data";
import { parseProduct } from "@/lib/parse";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const { id } = await ctx.params;
  const data = parseProduct(await req.json());
  if (!data.name) return Response.json({ error: "El nombre es obligatorio" }, { status: 400 });
  try {
    const [row] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, Number(id)))
      .returning();
    if (!row) return Response.json({ error: "No encontrado" }, { status: 404 });
    return Response.json(mapProduct(row));
  } catch {
    return Response.json({ error: "El slug ya existe, usa otro" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const { id } = await ctx.params;
  await db.delete(products).where(eq(products.id, Number(id)));
  return Response.json({ ok: true });
}
