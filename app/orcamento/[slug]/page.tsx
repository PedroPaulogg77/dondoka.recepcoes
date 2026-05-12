import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OrcamentoView } from "@/components/public/OrcamentoView";
import { fetchOrcamentoBySlug } from "@/lib/queries";

export const revalidate = 0;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orcamento } = await fetchOrcamentoBySlug(params.slug);
  if (!orcamento) return { title: "Proposta — Dondoka Recepções" };
  return {
    title: `Proposta para ${orcamento.cliente_nome} — Dondoka Recepções`,
    description: `Proposta personalizada para ${orcamento.cliente_nome}${
      orcamento.cliente_evento ? ` — ${orcamento.cliente_evento}` : ""
    }.`,
  };
}

export default async function OrcamentoPage({ params }: Props) {
  const { orcamento, config } = await fetchOrcamentoBySlug(params.slug);
  if (!orcamento || !config) notFound();
  return <OrcamentoView orcamento={orcamento} config={config} />;
}
