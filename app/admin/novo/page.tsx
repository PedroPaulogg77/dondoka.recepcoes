import { redirect } from "next/navigation";
import { OrcamentoForm } from "@/components/admin/OrcamentoForm";
import { fetchConfig } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NovoOrcamento() {
  const config = await fetchConfig();
  if (!config) redirect("/admin");
  return <OrcamentoForm mode="criar" config={config} />;
}
