import { db } from "@/db";
import { images } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ensureDb } from "@/lib/data";

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await ensureDb();
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Archivo requerido" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "Solo imágenes" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: "Máximo 5 MB" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const [row] = await db.insert(images).values({ mime: file.type, data: buf.toString("base64") }).returning({ id: images.id });
  return Response.json({ url: `/api/images/${row.id}` });
}
