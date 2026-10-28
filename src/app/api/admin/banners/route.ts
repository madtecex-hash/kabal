import { db } from "@/db";
import { banners } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ensureDb, getBanners } from "@/lib/data";
import { parseBanner } from "@/lib/parse";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(await getBanners(true));
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const data = parseBanner(await req.json());
  if (!data.title) return Response.json({ error: "El título es obligatorio" }, { status: 400 });
  const [row] = await db.insert(banners).values(data).returning();
  return Response.json(row);
}
