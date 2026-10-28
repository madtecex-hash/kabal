import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { isAdmin } from "@/lib/auth";
import { getBanners, getOrders, getProducts, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Panel de administración" };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  const [settings, products, banners, orders] = await Promise.all([getSettings(), getProducts(true), getBanners(true), getOrders()]);
  return <AdminDashboard initial={{ settings, products, banners, orders }} />;
}
