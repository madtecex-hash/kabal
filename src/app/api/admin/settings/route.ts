import { requireAdmin } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";
import type { Settings } from "@/lib/types";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(await getSettings());
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(defaultSettings) as (keyof Settings)[]) {
    if (!(key in body)) continue;
    const def = defaultSettings[key];
    const v = body[key];
    if (typeof def === "number") clean[key] = Number(v) || 0;
    else if (typeof def === "boolean") clean[key] = Boolean(v);
    else clean[key] = String(v ?? "");
  }
  return Response.json(await saveSettings(clean as Partial<Settings>));
}
