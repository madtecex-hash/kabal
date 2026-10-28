import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ensureDb, getProducts, mapProduct } from "@/lib/data";
import { parseProduct } from "@/lib/parse";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(await getProducts(true));
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const data = parseProduct(await req.json());
  if (!data.name) return Response.json({ error: "El nombre es obligatorio" }, { status: 400 });
  try {
    const [row] = await db.insert(products).values(data).returning();
    return Response.json(mapProduct(row));
  } catch {
    return Response.json({ error: "El slug ya existe, usa otro" }, { status: 400 });
  }
}
