import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { OrcamentoView } from "@/components/public/OrcamentoView";
import { fetchOrcamentoBySlug } from "@/lib/queries";

export const revalidate = 0;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orcamento } = await fetchOrcamentoBySlug(params.slug);
  if (!orcamento) return { title: "Proposta — Dondoka Recepções" };
  if (!orcamento.publicado) return { title: "Proposta em preparação — Dondoka Recepções" };
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

  if (!orcamento.publicado) {
    return (
      <div className="min-h-screen bg-creme flex flex-col items-center justify-center px-6 text-center">
        <Image
          src="/logos/logo-1.png"
          alt="Dondoka Recepções"
          width={180}
          height={80}
          className="mb-8 opacity-90"
        />
        <h1 className="font-serif text-2xl md:text-3xl text-carvao mb-3">
          Proposta em preparação
        </h1>
        <p className="text-carvao/60 text-base max-w-md">
          Em breve você receberá sua proposta personalizada.
        </p>
      </div>
    );
  }

  return <OrcamentoView orcamento={orcamento} config={config} />;
}
