import { redirect } from "next/navigation";
import { OrcamentoEditor } from "@/components/admin/OrcamentoEditor";
import { requirePageAuth } from "@/lib/auth-guard";
import { fetchConfig } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NovoOrcamento() {
  await requirePageAuth();
  const config = await fetchConfig();
  if (!config) redirect("/admin");
  return <OrcamentoEditor mode="criar" config={config} />;
}
