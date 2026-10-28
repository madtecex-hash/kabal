import { requireAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/data";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(await getOrders());
}
