import { redirect } from "next/navigation";
import { KitsManager } from "@/components/admin/KitsManager";
import { requirePageAuth } from "@/lib/auth-guard";
import { fetchConfig } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function KitsPage() {
  await requirePageAuth();
  const config = await fetchConfig();
  if (!config) redirect("/admin");
  return <KitsManager config={config} />;
}
