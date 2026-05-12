import { redirect } from "next/navigation";
import { ConfigForm } from "@/components/admin/ConfigForm";
import { fetchConfig } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const config = await fetchConfig();
  if (!config) redirect("/admin");
  return <ConfigForm config={config} />;
}
